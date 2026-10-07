import cloudinary from "@/lib/cloudinary";

const MAX_UPLOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = [500, 1500];
const UPLOAD_TIMEOUT_MS = 600000;

// Cloudinary rejects these outright; letters of any script, spaces and
// brackets are accepted, so only the genuinely invalid ones are replaced
export const sanitizePublicId = (name) =>
    name
        .replace(/\.[^/.]+$/, "")
        .replace(/[?&#\\%<>+]/g, "-")
        .replace(/\s+/g, " ")
        .replace(/-{2,}/g, "-")
        .trim()
        .slice(0, 120) || "file";

// Gateway failures and dropped sockets are both worth retrying; a rejected
// request (bad params, auth, quota) fails identically every time
const isTransient = (error) =>
    ["ECONNRESET", "ETIMEDOUT", "EPIPE", "ECONNABORTED"].includes(error?.code) ||
    [499, 500, 502, 503, 504].includes(error?.http_code);

// Picks the Cloudinary namespace from the browser's reported type
export const resolveResourceType = (mimeType = "") => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "raw";
};

const uploadOnce = (buffer, options) =>
    new Promise((resolve, reject) => {
        // The stream can settle through its callback, its error event or a throw
        // from end(); whichever happens first wins and the rest are ignored
        let isSettled = false;

        const settle = (fn, value) => {
            if (isSettled) return;
            isSettled = true;
            clearTimeout(timeout);
            fn(value);
        };

        const timeout = setTimeout(() => {
            settle(reject, new Error("Upload timeout"));
        }, UPLOAD_TIMEOUT_MS);

        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) settle(reject, error);
            else settle(resolve, result);
        });

        stream.on("error", (error) => settle(reject, error));

        // end() can throw synchronously on an already-dead socket, which would
        // otherwise escape the promise and surface as an unhandled rejection
        try {
            stream.end(buffer);
        } catch (error) {
            settle(reject, error);
        }
    });

// Uploads a buffer, retrying the failures that are worth retrying
export const uploadBuffer = async (buffer, options) => {
    let lastError;

    for (let attempt = 0; attempt < MAX_UPLOAD_ATTEMPTS; attempt += 1) {
        try {
            return await uploadOnce(buffer, {
                timeout: UPLOAD_TIMEOUT_MS,
                chunk_size: 6000000,
                ...options,
            });
        } catch (error) {
            lastError = error;

            const isLastAttempt = attempt === MAX_UPLOAD_ATTEMPTS - 1;
            if (!isTransient(error) || isLastAttempt) throw error;

            console.warn(
                `Cloudinary upload attempt ${attempt + 1} failed (${error.code || error.http_code}), retrying...`
            );

            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS[attempt] || 1500));
        }
    }

    throw lastError;
};

// Turns an upload failure into something the person can act on
export const describeUploadError = (error) => {
    if (error.message?.toLowerCase().includes("timeout")) {
        return "The upload timed out. Try a smaller file, or check your connection.";
    }

    if (["ECONNRESET", "ETIMEDOUT", "EPIPE", "ECONNABORTED"].includes(error.code)) {
        return "The connection was interrupted while uploading. A VPN or proxy tool is often the cause.";
    }

    if (error.http_code === 400) {
        return "That file was rejected. Try renaming it and uploading again.";
    }

    return "The file could not be uploaded. Please try again.";
};
import jwt from "jsonwebtoken";

const MASTER_SECRET =
    process.env.NEXTAUTH_SECRET || "nexfile-dev-secret-key-2024-change-in-production";

// Cookie proving a submitter entered the correct request password
export const REQUEST_ACCESS_COOKIE = "requestAccess";

// How long an unlocked request stays unlocked, in seconds
export const REQUEST_ACCESS_TTL_SECONDS = 60 * 60;

export const signRequestAccess = (requestId) =>
    jwt.sign({ type: "request-access", requestId: String(requestId) }, MASTER_SECRET, {
        expiresIn: REQUEST_ACCESS_TTL_SECONDS,
    });

export const verifyRequestAccess = (token, requestId) => {
    if (!token) return false;

    try {
        const payload = jwt.verify(token, MASTER_SECRET);
        return payload.type === "request-access" && payload.requestId === String(requestId);
    } catch {
        return false;
    }
};

// Scoped to one request, so unlocking one never unlocks another
export const getRequestAccessCookiePath = (token) => `/api/public/request/${token}`;
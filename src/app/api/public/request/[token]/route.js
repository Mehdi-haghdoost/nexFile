import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { verifyPassword } from "@/utils/auth/hashPassword";
import { FileRequestService } from "@/utils/fileRequests/fileRequestService";
import {
  REQUEST_ACCESS_COOKIE,
  REQUEST_ACCESS_TTL_SECONDS,
  getRequestAccessCookiePath,
  signRequestAccess,
  verifyRequestAccess,
} from "@/utils/fileRequests/fileRequestAccess";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

// Cloudinary rejects these outright; letters of any script and spaces are fine
const sanitizePublicId = (name) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[?&#\\%<>+]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "file";

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    let isSettled = false;

    const settle = (fn, value) => {
      if (isSettled) return;
      isSettled = true;
      fn(value);
    };

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) settle(reject, error);
      else settle(resolve, result);
    });

    // A stream error would otherwise escape the promise entirely
    stream.on("error", (error) => settle(reject, error));
    stream.end(buffer);
  });

// Public: what the landing page shows before anything is submitted
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { request: fileRequest, publicInfo } = await FileRequestService.getPublicRequest(token);

    // An unlocked submitter skips the password form on their next visit
    const isUnlocked =
      !fileRequest.hasPassword ||
      verifyRequestAccess(request.cookies.get(REQUEST_ACCESS_COOKIE)?.value, fileRequest._id);

    return NextResponse.json({
      success: true,
      request: { ...publicInfo, isUnlocked },
    });
  } catch (error) {
    const status = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load request" },
      { status }
    );
  }
}

// Verifies the request's password and grants access through a scoped cookie
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { request: fileRequest } = await FileRequestService.getPublicRequest(token);

    if (!fileRequest.hasPassword) {
      return NextResponse.json({ success: true });
    }

    const { password } = await request.json().catch(() => ({}));

    if (!password || !(await verifyPassword(password, fileRequest.password))) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // httpOnly and path-scoped so the proof never reaches scripts or another request
    response.cookies.set(REQUEST_ACCESS_COOKIE, signRequestAccess(fileRequest._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: getRequestAccessCookiePath(token),
      maxAge: REQUEST_ACCESS_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    const status = error.message?.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to unlock request" },
      { status }
    );
  }
}

// Accepts a file from the public link and stores it in the request's folder
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { token } = await params;
    const { request: fileRequest } = await FileRequestService.getPublicRequest(token);

    // Checked here rather than only in the page, which a submitter can bypass
    const closedReason = FileRequestService.getClosedReason(fileRequest);
    if (closedReason) {
      return NextResponse.json({ success: false, message: closedReason }, { status: 403 });
    }

    if (fileRequest.hasPassword) {
      const accessToken = request.cookies.get(REQUEST_ACCESS_COOKIE)?.value;

      if (!verifyRequestAccess(accessToken, fileRequest._id)) {
        return NextResponse.json(
          { success: false, message: "Enter the password before uploading" },
          { status: 401 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const submitterName = (formData.get("submitterName") || "").toString().trim();

    if (!submitterName) {
      return NextResponse.json(
        { success: false, message: "Your name is required" },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Choose a file to send" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File size exceeds the 100MB limit" },
        { status: 400 }
      );
    }

    let resourceType = "raw";
    if (file.type?.startsWith("image/")) resourceType = "image";
    else if (file.type?.startsWith("video/")) resourceType = "video";

    const buffer = Buffer.from(await file.arrayBuffer());

    // Stored under the owner's folder, since the file becomes theirs on arrival
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: `nexfile/${fileRequest.owner}/${fileRequest.folder}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${sanitizePublicId(file.name)}`,
      timeout: 600000,
      chunk_size: 6000000,
    });

    await FileRequestService.recordSubmission(fileRequest, {
      submitterName: submitterName.slice(0, 100),
      uploadResult,
      originalFile: file,
    });

    return NextResponse.json({ success: true, message: "File sent" }, { status: 201 });
  } catch (error) {
    console.error("File request submission error:", error);

    const status = error.message?.includes("not found") ? 404 : 500;

    return NextResponse.json(
      { success: false, message: "The file could not be sent. Please try again." },
      { status }
    );
  }
}
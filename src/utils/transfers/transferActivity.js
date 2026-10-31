import crypto from "crypto";
import TransferActivity from "@/models/TransferActivity";
import { verifyAccessToken } from "@/utils/auth/tokenManager";
import { getClientAddress } from "@/utils/transfers/transferRateLimit";

// Development-only key, so local testing works without configuring a secret
const DEV_VISITOR_SECRET = "nexfile-dev-visitor-secret";

// A known key would let anyone reverse the hash by trying every address, so production needs a real one
const getVisitorSecret = () => {
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
  return process.env.NODE_ENV === "production" ? null : DEV_VISITOR_SECRET;
};

// Keyed per transfer, so the same person cannot be followed from one transfer to another
export const getVisitorHash = (request, transferId) => {
  const secret = getVisitorSecret();
  if (!secret) return null;

  return crypto
    .createHmac("sha256", secret)
    .update(`transfer-visitor:${transferId}:${getClientAddress(request)}`)
    .digest("hex");
};

// The owner opening their own link is not a visit worth reporting
const isOwnerRequest = (request, transfer) => {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;

  try {
    const decoded = verifyAccessToken(token);
    return Boolean(decoded?.userId) && decoded.userId.toString() === transfer.owner.toString();
  } catch {
    return false;
  }
};

// Records a public view or download; a failure is only logged, so the recipient's request still succeeds
export const recordTransferActivity = async (request, transfer, { kind, fileName = null }) => {
  try {
    if (isOwnerRequest(request, transfer)) return;

    await TransferActivity.create({
      transfer: transfer._id,
      owner: transfer.owner,
      kind,
      fileName,
      visitorHash: getVisitorHash(request, transfer._id),
    });
  } catch (error) {
    console.error(`Transfer activity not recorded for ${transfer?._id}:`, error.message);
  }
};
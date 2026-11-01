import crypto from "crypto";
import TransferActivity from "@/models/TransferActivity";
import TransferViewMarker, { ensureTransferViewMarkerIndexes } from "@/models/TransferViewMarker";
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

// A repeat view from the same visitor inside this window is not recorded again
export const VIEW_DEDUPE_MINUTES = 30;

const VIEW_DEDUPE_MS = VIEW_DEDUPE_MINUTES * 60 * 1000;

// MongoDB's code for a unique index violation
const DUPLICATE_KEY = 11000;

// Atomically claims the right to record this view; only one request per visitor wins inside the window
const claimView = async (transferId, visitorHash) => {
  await ensureTransferViewMarkerIndexes();

  const claimedAt = new Date();
  const windowStart = new Date(claimedAt.getTime() - VIEW_DEDUPE_MS);

  try {
    // Matches only a marker older than the window; with none, the upsert inserts one
    const previous = await TransferViewMarker.findOneAndUpdate(
      { transfer: transferId, visitorHash, lastRecordedAt: { $lt: windowStart } },
      { $set: { lastRecordedAt: claimedAt } },
      { upsert: true, returnDocument: "before" }
    ).lean();

    return { claimedAt, previousAt: previous?.lastRecordedAt || null };
  } catch (error) {
    // A recent marker exists, so inserting another breaks the unique index: this view is a repeat
    if (error?.code === DUPLICATE_KEY) return null;
    throw error;
  }
};

// Undoes a claim whose activity insert failed, so the visitor's next view can still be recorded
const releaseView = async (transferId, visitorHash, { claimedAt, previousAt }) => {
  // Matching on claimedAt leaves a newer claim from another request untouched
  const claim = { transfer: transferId, visitorHash, lastRecordedAt: claimedAt };

  try {
    if (previousAt) {
      await TransferViewMarker.updateOne(claim, { $set: { lastRecordedAt: previousAt } });
    } else {
      await TransferViewMarker.deleteOne(claim);
    }
  } catch (error) {
    console.error(`Transfer view claim not released for ${transferId}:`, error.message);
  }
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

    const visitorHash = getVisitorHash(request, transfer._id);

    // Only views are deduplicated; downloads always count, and a view without a hash cannot be matched
    const claim = kind === "view" && visitorHash ? await claimView(transfer._id, visitorHash) : undefined;
    if (claim === null) return;

    try {
      await TransferActivity.create({
        transfer: transfer._id,
        owner: transfer.owner,
        kind,
        fileName,
        visitorHash,
      });
    } catch (error) {
      if (claim) await releaseView(transfer._id, visitorHash, claim);
      throw error;
    }
  } catch (error) {
    console.error(`Transfer activity not recorded for ${transfer?._id}:`, error.message);
  }
};
import mongoose from "mongoose";

// Markers are only needed for the 30-minute window, so MongoDB removes them a day after the last view
const MARKER_TTL_SECONDS = 24 * 60 * 60;

// The time of the last view recorded for one visitor on one transfer
const TransferViewMarkerSchema = new mongoose.Schema({
  transfer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transfer",
    required: true,
  },

  // Same keyed hash as the activity record, so it identifies nobody outside its transfer
  visitorHash: {
    type: String,
    required: true,
  },

  lastRecordedAt: {
    type: Date,
    required: true,
  },
});

// One marker per visitor per transfer; the atomic view claim depends on this being unique
TransferViewMarkerSchema.index({ transfer: 1, visitorHash: 1 }, { unique: true });

// Lets MongoDB drop markers once they are far outside the dedupe window
TransferViewMarkerSchema.index({ lastRecordedAt: 1 }, { expireAfterSeconds: MARKER_TTL_SECONDS });

const TransferViewMarker =
  mongoose.models.TransferViewMarker ||
  mongoose.model("TransferViewMarker", TransferViewMarkerSchema);

// Shared by every caller in this process, so the indexes are built at most once per server start
let indexesReady = null;

// Builds the indexes explicitly instead of relying on autoIndex, which production may turn off
export const ensureTransferViewMarkerIndexes = () => {
  if (!indexesReady) {
    indexesReady = TransferViewMarker.createIndexes().catch((error) => {
      // A failed build is retried on the next call rather than remembered
      indexesReady = null;
      throw error;
    });
  }

  return indexesReady;
};

export default TransferViewMarker;
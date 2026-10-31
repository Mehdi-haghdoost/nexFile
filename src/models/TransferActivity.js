import mongoose from "mongoose";

// Activity is kept for 90 days, then MongoDB removes it
const ACTIVITY_TTL_SECONDS = 90 * 24 * 60 * 60;

// One document per public view or download of a transfer
const TransferActivitySchema = new mongoose.Schema({
  transfer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transfer",
    required: true,
  },

  // Copied from the transfer, so an owner's activity is read without a join
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  kind: {
    type: String,
    enum: ["view", "download", "download_all"],
    required: true,
  },

  // Set for a single-file download only
  fileName: {
    type: String,
    default: null,
  },

  // Keyed hash of the visitor's address; null when production has no secret configured
  visitorHash: {
    type: String,
    default: null,
  },

  occurredAt: {
    type: Date,
    default: Date.now,
  },
});

// Serves the owner's activity feed and each transfer's history, newest first
TransferActivitySchema.index({ owner: 1, occurredAt: -1 });
TransferActivitySchema.index({ transfer: 1, occurredAt: -1 });

// Lets MongoDB drop activity once it is older than the retention period
TransferActivitySchema.index({ occurredAt: 1 }, { expireAfterSeconds: ACTIVITY_TTL_SECONDS });

const TransferActivity =
  mongoose.models.TransferActivity ||
  mongoose.model("TransferActivity", TransferActivitySchema);

export default TransferActivity;
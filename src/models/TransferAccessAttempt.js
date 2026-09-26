import mongoose from "mongoose";

// One document per IP and transfer, counting consecutive wrong passwords
const TransferAccessAttemptSchema = new mongoose.Schema(
  {
    transfer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transfer",
      required: true,
    },

    // Hashed rather than stored raw, since it is personal data and only equality is needed
    clientHash: {
      type: String,
      required: true,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    // Drives the TTL index, refreshed on every attempt
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One counter per client and transfer
TransferAccessAttemptSchema.index({ transfer: 1, clientHash: 1 }, { unique: true });

// Lets MongoDB drop idle counters after a day so the collection stays small
TransferAccessAttemptSchema.index({ lastAttemptAt: 1 }, { expireAfterSeconds: 86400 });

const TransferAccessAttempt =
  mongoose.models.TransferAccessAttempt ||
  mongoose.model("TransferAccessAttempt", TransferAccessAttemptSchema);

export default TransferAccessAttempt;
import mongoose from "mongoose";

const twoFactorRecoverySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // SHA-256 of the emailed token, so the database never holds a usable link.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Let MongoDB drop records once they are past their expiry.
twoFactorRecoverySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const TwoFactorRecovery =
  mongoose.models.TwoFactorRecovery ||
  mongoose.model("TwoFactorRecovery", twoFactorRecoverySchema);

export default TwoFactorRecovery;
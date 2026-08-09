// import mongoose from "mongoose";

// const refreshTokenSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     token: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     expiresAt: {
//       type: Date,
//       required: true,
//     },
//     isRevoked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const RefreshToken = mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);

// export default RefreshToken;

import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    // Timestamp of when this token was rotated out. Used to compute the grace
    // window that allows concurrent requests to survive a rotation.
    revokedAt: {
      type: Date,
      default: null,
    },
    // The refresh token that replaced this one during rotation. Lets a racing
    // request recover the current valid token instead of being logged out.
    replacedByToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for the hot lookup path in claimRefreshToken()
refreshTokenSchema.index({ token: 1, isRevoked: 1, expiresAt: 1 });

// Let MongoDB remove documents once they are past their absolute expiry.
// expireAfterSeconds: 0 means "delete as soon as expiresAt is in the past".
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken =
  mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: false,
//       default: "",
//     },
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     image: {
//       type: String,
//       default: null,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.models.User || mongoose.model("User", UserSchema);

// export default User;

import mongoose from "mongoose";

// Hashed backup code. usedAt marks single-use consumption.
const BackupCodeSchema = new mongoose.Schema(
  {
    codeHash: { type: String, required: true },
    usedAt: { type: Date, default: null },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Set whenever the password changes. Lets the UI show "last updated".
    passwordUpdatedAt: {
      type: Date,
      default: null,
    },

    /* ---------------------------------------------------------------- */
    /* Two-factor authentication (TOTP)                                  */
    /* All fields are select:false so they never leak through a plain    */
    /* findById() used elsewhere in the app.                             */
    /* ---------------------------------------------------------------- */

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    // AES-256-GCM encrypted base32 secret, active only once enabled.
    twoFactorSecret: {
      type: String,
      default: null,
      select: false,
    },
    // Holds the secret between "show QR" and "confirm code".
    twoFactorPendingSecret: {
      type: String,
      default: null,
      select: false,
    },
    twoFactorPendingCreatedAt: {
      type: Date,
      default: null,
      select: false,
    },
    twoFactorBackupCodes: {
      type: [BackupCodeSchema],
      default: [],
      select: false,
    },
    // Last accepted TOTP counter, blocks replay of a code inside its window.
    twoFactorLastCounter: {
      type: Number,
      default: null,
      select: false,
    },
    twoFactorEnabledAt: {
      type: Date,
      default: null,
    },
    // Brute-force guard: 6 digits is only 1M combinations.
    twoFactorFailedAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    twoFactorLockedUntil: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
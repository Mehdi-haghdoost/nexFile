import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    // Optional label only; no email is actually sent
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Member", "Guest"],
      default: "Member",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const Invite = mongoose.models.Invite || mongoose.model("Invite", InviteSchema);

export default Invite;
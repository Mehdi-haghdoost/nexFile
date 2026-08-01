import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Member", "Guest"],
      default: "Member",
    },
    permission: {
      type: String,
      enum: ["Can Edit", "Can View", "No Access"],
      default: "Can View",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "removed"],
      default: "active",
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A user can only have one membership per organization
MembershipSchema.index({ organization: 1, user: 1 }, { unique: true });

const Membership =
  mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);

export default Membership;
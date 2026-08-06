import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Short machine-readable action key, e.g. 'member.invited'
    action: {
      type: String,
      required: true,
    },
    // Human-readable sentence shown in the activity table
    description: {
      type: String,
      required: true,
    },
    // Grouping label shown under the description, e.g. 'Members', 'Groups'
    category: {
      type: String,
      default: "General",
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ organization: 1, createdAt: -1 });

const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
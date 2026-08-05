import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: 100,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    // Tailwind gradient classes used for the group's icon tile
    gradient: {
      type: String,
      default: "from-[#5C9FEC] to-[#186BCB]",
    },
    // The membership acting as this group's manager
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      default: null,
    },
    // Memberships belonging to this group
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership",
      },
    ],
    permission: {
      type: String,
      enum: ["Manage access", "Edit", "View only"],
      default: "View only",
    },
  },
  { timestamps: true }
);

GroupSchema.index({ organization: 1, name: 1 });

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);

export default Group;
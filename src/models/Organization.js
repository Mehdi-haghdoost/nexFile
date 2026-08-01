import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    // One owned organization per user, in this simplified model
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      default: "Free",
    },
  },
  { timestamps: true }
);

const Organization =
  mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

export default Organization;
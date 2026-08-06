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
    // Organization-wide security settings shown in the admin console
    security: {
      twoStepVerification: { type: Boolean, default: false },
      linkPassword: { type: Boolean, default: false },
      linkExpiration: { type: Boolean, default: false },
      externalSharing: {
        type: String,
        enum: ["Email and link", "Email only", "Link only", "Disabled"],
        default: "Email and link",
      },
    },
  },
  { timestamps: true }
);

const Organization =
  mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

export default Organization;
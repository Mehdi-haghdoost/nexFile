import mongoose from "mongoose";
import { TRANSFER_MAX_MESSAGE_LENGTH } from "@/utils/constants/transferConstants";

// One entry per file attached to a transfer
const TransferFileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    extension: {
      type: String,
      lowercase: true,
      default: "file",
    },

    mimeType: {
      type: String,
      default: "application/octet-stream",
    },

    // Raw byte count, formatted for display on the client
    size: {
      type: Number,
      default: 0,
    },

    url: {
      type: String,
      default: null,
    },

    cloudinaryId: {
      type: String,
      default: null,
    },

    // Needed to build a delivery URL and to destroy the asset later
    resourceType: {
      type: String,
      default: "raw",
    },
  },
  { _id: false }
);

// One entry per person the transfer was emailed to
const TransferRecipientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Whether the mail server accepted the notification email
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },

    sentAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const TransferSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: [true, "Transfer name is required"],
      trim: true,
      maxlength: [255, "Transfer name cannot exceed 255 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transfer owner is required"],
      index: true,
    },

    type: {
      type: String,
      enum: ["link", "email"],
      default: "link",
    },

    // Public identifier used to build the share link
    token: {
      type: String,
      required: true,
      unique: true,
    },

    files: [TransferFileSchema],

    // Denormalized so the list view does not have to load every file entry
    filesCount: {
      type: Number,
      default: 0,
    },

    totalSize: {
      type: Number,
      default: 0,
    },

    recipients: [TransferRecipientSchema],

    // Optional note from the sender, included in recipient emails
    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: TRANSFER_MAX_MESSAGE_LENGTH,
    },

    expirationDate: {
      type: Date,
      required: true,
      index: true,
    },

    // Set when the sender ends a transfer early, cleared when it is reactivated
    endedAt: {
      type: Date,
      default: null,
    },

    isPasswordEnabled: {
      type: Boolean,
      default: false,
    },

    // Stored as a bcrypt hash via utils/auth/hashPassword, never in plain text
    password: {
      type: String,
      default: null,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TransferSchema.index({ owner: 1, isDeleted: 1 });
TransferSchema.index({ "recipients.email": 1, isDeleted: 1 });
TransferSchema.index({ groupName: "text" });

const Transfer = mongoose.models.Transfer || mongoose.model("Transfer", TransferSchema);

export default Transfer;
import mongoose from "mongoose";

const FileRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },

    // Unique token used to build the public upload link
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["opened", "closed"],
      default: "opened",
    },

    hasDeadline: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      default: null,
    },

    hasPassword: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String, // bcrypt hash
      default: null,
    },

    submittersCount: {
      type: Number,
      default: 0,
    },
    uploadsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

FileRequestSchema.index({ owner: 1, status: 1 });

const FileRequest =
  mongoose.models.FileRequest || mongoose.model("FileRequest", FileRequestSchema);

export default FileRequest;
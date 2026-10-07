import mongoose from "mongoose";

// One entry per file someone sent through the public link
const SubmissionSchema = new mongoose.Schema(
  {
    submitterName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // The stored file this produced, so the owner can open what was sent
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

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

    // What actually arrived, rather than only how much
    submissions: [SubmissionSchema],

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
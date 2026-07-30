import mongoose from "mongoose";

const FileViewSchema = new mongoose.Schema(
  {
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
      index: true,
    },
    // The file owner, so monitoring queries stay scoped to one user
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    viewerName: {
      type: String,
      required: true,
      trim: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

FileViewSchema.index({ owner: 1, viewedAt: -1 });

const FileView =
  mongoose.models.FileView || mongoose.model("FileView", FileViewSchema);

export default FileView;
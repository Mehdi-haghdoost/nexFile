import crypto from "crypto";
import FileView from "@/models/FileView";
import File from "@/models/File";

// Demo viewer names used when seeding sample activity
const SAMPLE_VIEWERS = ["Adrian Carter", "Bella Thompson", "Marcus Reed", "Nadia Silva"];

export class MonitorService {
  // Demo helper: register a send for a file and seed a few sample views
  static async createSendWithSampleViews(fileId, ownerId) {
    const file = await File.findOne({
      _id: fileId,
      owner: ownerId,
      isDeleted: false,
    });

    if (!file) {
      throw new Error("File not found");
    }

    const token = crypto.randomBytes(10).toString("hex");

    // Seed 1-3 sample views so the monitor table has data to show
    const count = 1 + Math.floor(Math.random() * 3);
    const docs = [];

    for (let i = 0; i < count; i++) {
      docs.push({
        file: file._id,
        owner: ownerId,
        viewerName: SAMPLE_VIEWERS[i % SAMPLE_VIEWERS.length],
        durationSeconds: 60 + Math.floor(Math.random() * 900),
        viewedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      });
    }

    await FileView.insertMany(docs);

    return { token, seededViews: docs.length, fileName: file.name };
  }

  // One row per view: who opened which file, for how long
  static async getViewerRows(ownerId) {
    const views = await FileView.find({ owner: ownerId })
      .populate({ path: "file", select: "name extension" })
      .sort({ viewedAt: -1 })
      .limit(50)
      .lean();

    return views
      .filter((v) => v.file) // skip views whose file was deleted
      .map((v) => ({
        id: v._id.toString(),
        viewerName: v.viewerName,
        fileName: v.file.name,
        extension: v.file.extension,
        durationSeconds: v.durationSeconds,
        viewedAt: v.viewedAt,
      }));
  }

  // One row per file: unique viewers and last access time
  static async getFileRows(ownerId) {
    const views = await FileView.find({ owner: ownerId })
      .populate({ path: "file", select: "name extension" })
      .lean();

    // Group views by file to count unique viewers and find latest access
    const byFile = new Map();

    for (const v of views) {
      if (!v.file) continue;

      const key = v.file._id.toString();
      if (!byFile.has(key)) {
        byFile.set(key, {
          id: key,
          fileName: v.file.name,
          extension: v.file.extension,
          viewers: new Set(),
          lastViewedAt: v.viewedAt,
        });
      }

      const entry = byFile.get(key);
      entry.viewers.add(v.viewerName);
      if (new Date(v.viewedAt) > new Date(entry.lastViewedAt)) {
        entry.lastViewedAt = v.viewedAt;
      }
    }

    return Array.from(byFile.values())
      .map((e) => ({
        id: e.id,
        fileName: e.fileName,
        extension: e.extension,
        viewersCount: e.viewers.size,
        lastViewedAt: e.lastViewedAt,
      }))
      .sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt));
  }
}
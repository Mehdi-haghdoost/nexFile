// One-off repair for folder counters that drifted out of step with reality.
// Run with: node scripts/recount-folders.js [--apply]
// Without --apply it reports what it would change and writes nothing.

const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const isDryRun = !process.argv.includes("--apply");

// Minimal schemas, since this runs outside the app and only needs these fields
const folderSchema = new mongoose.Schema(
  {
    name: String,
    owner: mongoose.Schema.Types.ObjectId,
    parentFolder: mongoose.Schema.Types.ObjectId,
    filesCount: Number,
    subFoldersCount: Number,
    totalSize: Number,
    isDeleted: Boolean,
  },
  { collection: "folders", strict: false }
);

const fileSchema = new mongoose.Schema(
  {
    name: String,
    owner: mongoose.Schema.Types.ObjectId,
    folder: mongoose.Schema.Types.ObjectId,
    size: Number,
    isDeleted: Boolean,
  },
  { collection: "files", strict: false }
);

const Folder = mongoose.model("Folder", folderSchema);
const File = mongoose.model("File", fileSchema);

// Counters describe what is live, so deleted items are excluded from both
const countFolderContents = async (folderId) => {
  const [files, subFolders] = await Promise.all([
    File.find({ folder: folderId, isDeleted: false }).select("size"),
    Folder.countDocuments({ parentFolder: folderId, isDeleted: false }),
  ]);

  return {
    filesCount: files.length,
    subFoldersCount: subFolders,
    // Direct files only; a recursive total is computed on demand where needed
    totalSize: files.reduce((sum, file) => sum + (file.size || 0), 0),
  };
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected. ${isDryRun ? "Dry run" : "Applying changes"}.\n`);

  const folders = await Folder.find({}).select(
    "name filesCount subFoldersCount totalSize isDeleted"
  );

  let driftedCount = 0;

  for (const folder of folders) {
    const actual = await countFolderContents(folder._id);

    const changes = [];
    if ((folder.filesCount || 0) !== actual.filesCount) {
      changes.push(`files ${folder.filesCount || 0} to ${actual.filesCount}`);
    }
    if ((folder.subFoldersCount || 0) !== actual.subFoldersCount) {
      changes.push(`subfolders ${folder.subFoldersCount || 0} to ${actual.subFoldersCount}`);
    }
    if ((folder.totalSize || 0) !== actual.totalSize) {
      changes.push(`size ${folder.totalSize || 0} to ${actual.totalSize}`);
    }

    if (!changes.length) continue;

    driftedCount += 1;
    console.log(`${folder.name}${folder.isDeleted ? " (deleted)" : ""}: ${changes.join(", ")}`);

    if (!isDryRun) {
      await Folder.updateOne({ _id: folder._id }, { $set: actual });
    }
  }

  // Files whose folder no longer exists are counted by nothing and listed nowhere
  const liveFiles = await File.find({ isDeleted: false, folder: { $ne: null } }).select("name folder");
  const folderIds = new Set(folders.map((folder) => folder._id.toString()));
  const orphans = liveFiles.filter((file) => !folderIds.has(file.folder.toString()));

  console.log(`\n${driftedCount} of ${folders.length} folders had drifted.`);

  if (orphans.length) {
    console.log(`\n${orphans.length} files point at a folder that no longer exists:`);
    orphans.forEach((file) => console.log(`  ${file.name} (folder ${file.folder})`));
    console.log("These are left alone; move or delete them by hand.");
  }

  if (isDryRun && driftedCount) {
    console.log("\nRun again with --apply to write these changes.");
  }

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Recount failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
const mongoose = require("mongoose");

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

const sumSize = (files) => files.reduce((total, file) => total + (file.size || 0), 0);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const folders = await Folder.find({}).select(
    "name owner filesCount subFoldersCount totalSize isDeleted"
  );

  let drifted = 0;

  for (const folder of folders) {
    const [active, deleted] = await Promise.all([
      File.find({ folder: folder._id, isDeleted: false }).select("size"),
      File.find({ folder: folder._id, isDeleted: true }).select("size"),
    ]);

    const stored = { count: folder.filesCount || 0, size: folder.totalSize || 0 };
    const actual = { count: active.length, size: sumSize(active) };

    if (stored.count === actual.count && stored.size === actual.size) continue;

    drifted += 1;

    const cascadeCount = actual.count + deleted.length;
    const cascadeSize = actual.size + sumSize(deleted);

    console.log(`${folder.name}${folder.isDeleted ? " (in trash)" : ""}`);
    console.log(`  stored   ${stored.count} files, ${stored.size} bytes`);
    console.log(`  active   ${actual.count} files, ${actual.size} bytes`);
    console.log(`  deleted  ${deleted.length} files, ${sumSize(deleted)} bytes`);

    // Stored counters matching active plus deleted is the folder cascade's fingerprint
    if (stored.count === cascadeCount && stored.size === cascadeSize) {
      console.log("  cause    folder cascade left the hidden files counted");
    } else if (deleted.length === 0 && stored.count > actual.count) {
      // No records at all behind the surplus, so whatever removed them never decremented
      console.log("  cause    counts files with no record at all, hard-deleted without a decrement");
    } else {
      console.log(
        `  cause    unexplained, ${stored.count - cascadeCount} files and ${stored.size - cascadeSize} bytes unaccounted for`
      );
    }

    console.log("");
  }

  console.log(drifted ? `${drifted} folder(s) drifted.` : "All counters match.");

  const folderOwners = new Map(
    folders.map((folder) => [folder._id.toString(), folder.owner?.toString()])
  );

  // Files whose folder no longer exists are counted by nothing and listed nowhere
  const parented = await File.find({ folder: { $ne: null } }).select("name owner folder isDeleted");
  const orphans = parented.filter((file) => !folderOwners.has(file.folder.toString()));

  if (orphans.length) {
    console.log(`\n${orphans.length} file(s) point at a folder that no longer exists:`);
    orphans.forEach((file) => console.log(`  ${file.name}${file.isDeleted ? " (deleted)" : ""}`));
  }

  // A file owned by someone other than its folder counts toward a folder its owner cannot see
  const mismatched = parented.filter((file) => {
    const folderOwner = folderOwners.get(file.folder.toString());
    return folderOwner && file.owner?.toString() !== folderOwner;
  });

  if (mismatched.length) {
    console.log(`\n${mismatched.length} file(s) are owned by someone other than their folder:`);
    mismatched.forEach((file) => console.log(`  ${file.name}`));
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
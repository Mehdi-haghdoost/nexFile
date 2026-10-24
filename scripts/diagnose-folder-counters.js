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
    mimeType: String,
    cloudinaryId: String,
    isDeleted: Boolean,
    metadata: { resourceType: String },
    submission: {
      fileRequest: mongoose.Schema.Types.ObjectId,
      submitterName: String,
    },
  },
  { collection: "files", strict: false }
);

const fileRequestSchema = new mongoose.Schema(
  {
    title: String,
    uploadsCount: Number,
    submittersCount: Number,
    submissions: [
      {
        submitterName: String,
        file: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { collection: "filerequests", strict: false }
);

const Folder = mongoose.model("Folder", folderSchema);
const File = mongoose.model("File", fileSchema);
const FileRequest = mongoose.model("FileRequest", fileRequestSchema);

const MAX_LISTED = 20;

const sumSize = (files) => files.reduce((total, file) => total + (file.size || 0), 0);

// Prints a capped list under a heading and returns how many items were found
const reportList = (title, items, describe) => {
  if (!items.length) return 0;

  console.log(`\n${items.length} ${title}:`);
  items.slice(0, MAX_LISTED).forEach((item) => console.log(`  ${describe(item)}`));

  if (items.length > MAX_LISTED) {
    console.log(`  ... and ${items.length - MAX_LISTED} more`);
  }

  return items.length;
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Checks that found something, reported together at the end
  const failedChecks = [];
  const recordFailure = (name, count) => {
    if (count) failedChecks.push(`${name} (${count})`);
  };

  const folders = await Folder.find({}).select(
    "name owner parentFolder filesCount subFoldersCount totalSize isDeleted"
  );

  const folderById = new Map(folders.map((folder) => [folder._id.toString(), folder]));

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
  recordFailure("file counters", drifted);

  // Active child folders owned by the parent's owner, the same rule the reconcile applies
  const activeChildren = new Map();

  folders.forEach((folder) => {
    if (folder.isDeleted || !folder.parentFolder) return;

    const parent = folderById.get(folder.parentFolder.toString());
    if (!parent || parent.owner?.toString() !== folder.owner?.toString()) return;

    const key = parent._id.toString();
    activeChildren.set(key, (activeChildren.get(key) || 0) + 1);
  });

  const subfolderDrift = folders.filter(
    (folder) =>
      (folder.subFoldersCount || 0) !== (activeChildren.get(folder._id.toString()) || 0)
  );

  recordFailure(
    "subfolder counters",
    reportList("folder(s) have a wrong subfolder count", subfolderDrift, (folder) =>
      `${folder.name}${folder.isDeleted ? " (in trash)" : ""}: stored ${folder.subFoldersCount || 0}, actual ${activeChildren.get(folder._id.toString()) || 0}`
    )
  );

  // Files whose folder no longer exists are counted by nothing and listed nowhere
  const parented = await File.find({ folder: { $ne: null } }).select("name owner folder isDeleted");
  const orphans = parented.filter((file) => !folderById.has(file.folder.toString()));

  recordFailure(
    "orphaned files",
    reportList("file(s) point at a folder that no longer exists", orphans, (file) =>
      `${file.name}${file.isDeleted ? " (deleted)" : ""}`
    )
  );

  // A file owned by someone other than its folder counts toward a folder its owner cannot see
  const mismatched = parented.filter((file) => {
    const folderOwner = folderById.get(file.folder.toString())?.owner?.toString();
    return folderOwner && file.owner?.toString() !== folderOwner;
  });

  recordFailure(
    "file owner mismatches",
    reportList("file(s) are owned by someone other than their folder", mismatched, (file) => file.name)
  );

  // A folder whose parent was removed is unreachable from the tree
  const orphanFolders = folders.filter(
    (folder) => folder.parentFolder && !folderById.has(folder.parentFolder.toString())
  );

  recordFailure(
    "orphaned folders",
    reportList("folder(s) point at a parent that no longer exists", orphanFolders, (folder) =>
      `${folder.name}${folder.isDeleted ? " (in trash)" : ""}`
    )
  );

  // A subfolder under another owner's parent is invisible to its own owner
  const foreignParent = folders.filter((folder) => {
    if (!folder.parentFolder) return false;
    const parent = folderById.get(folder.parentFolder.toString());
    return parent && parent.owner?.toString() !== folder.owner?.toString();
  });

  recordFailure(
    "folders under another owner's parent",
    reportList("folder(s) sit under a parent owned by someone else", foreignParent, (folder) => folder.name)
  );

  // An active folder under a trashed parent was created or restored around its cascade
  const activeUnderTrashed = folders.filter(
    (folder) =>
      !folder.isDeleted &&
      folder.parentFolder &&
      folderById.get(folder.parentFolder.toString())?.isDeleted
  );

  recordFailure(
    "active folders in trash",
    reportList("active folder(s) sit under a trashed parent", activeUnderTrashed, (folder) => folder.name)
  );

  const trashedFolderIds = folders.filter((folder) => folder.isDeleted).map((folder) => folder._id);

  const activeFilesInTrash = trashedFolderIds.length
    ? await File.find({ folder: { $in: trashedFolderIds }, isDeleted: false }).select("name folder")
    : [];

  recordFailure(
    "active files in trash",
    reportList("active file(s) sit inside a trashed folder", activeFilesInTrash, (file) =>
      `${file.name} (in ${folderById.get(file.folder.toString())?.name})`
    )
  );

  // Files stored without a resource type are destroyed as raw, which misses images and videos
  const withoutResourceType = await File.find({
    cloudinaryId: { $ne: null },
    "metadata.resourceType": { $exists: false },
  }).select("name mimeType isDeleted");

  const atRisk = withoutResourceType.filter((file) =>
    /^(image|video|audio)\//.test(file.mimeType || "")
  );

  if (withoutResourceType.length) {
    console.log(
      `\n${withoutResourceType.length} stored file(s) have no resource type, ${atRisk.length} of them would be destroyed with the wrong type.`
    );
  }

  recordFailure(
    "files at risk of a wrong destroy",
    reportList("file(s) would be destroyed as raw but are not documents", atRisk, (file) =>
      `${file.name} (${file.mimeType})${file.isDeleted ? " (deleted)" : ""}`
    )
  );

  // Lean documents keep a missing ledger array missing, which is how legacy requests are told apart
  const requests = await FileRequest.find({})
    .select("title uploadsCount submittersCount submissions")
    .lean();

  console.log(`\nInspected ${requests.length} file request(s).`);

  const provenanceFiles = await File.find({
    "submission.fileRequest": { $ne: null },
  }).select("name submission isDeleted");

  const provenanceByRequest = new Map();

  provenanceFiles.forEach((file) => {
    const key = file.submission.fileRequest.toString();
    if (!provenanceByRequest.has(key)) provenanceByRequest.set(key, []);
    provenanceByRequest.get(key).push(file);
  });

  const ledgerFileIds = requests.flatMap((request) =>
    (request.submissions || []).map((entry) => entry.file).filter(Boolean)
  );

  const ledgerFiles = ledgerFileIds.length
    ? await File.find({ _id: { $in: ledgerFileIds } }).select("submission")
    : [];

  const ledgerFileById = new Map(ledgerFiles.map((file) => [file._id.toString(), file]));

  const missingFromLedger = [];
  const wrongCounters = [];
  const legacyRequests = [];
  let deletedFileEntries = 0;
  let preProvenanceEntries = 0;

  requests.forEach((request) => {
    const entries = request.submissions || [];
    const ledgerIds = new Set(entries.map((entry) => entry.file?.toString()).filter(Boolean));

    (provenanceByRequest.get(request._id.toString()) || []).forEach((file) => {
      if (!ledgerIds.has(file._id.toString())) {
        missingFromLedger.push({ request, file });
      }
    });

    // A request with no ledger array predates it, so its counters have nothing to be compared with
    if (request.submissions === undefined) {
      legacyRequests.push(request);
      return;
    }

    const uniqueNames = new Set(
      entries.map((entry) => (entry.submitterName || "").toLowerCase())
    ).size;

    if ((request.uploadsCount || 0) !== entries.length || (request.submittersCount || 0) !== uniqueNames) {
      wrongCounters.push({ request, entries: entries.length, uniqueNames });
    }

    entries.forEach((entry) => {
      const file = entry.file ? ledgerFileById.get(entry.file.toString()) : null;

      if (!file) {
        deletedFileEntries += 1;
      } else if (!file.submission?.fileRequest) {
        preProvenanceEntries += 1;
      }
    });
  });

  recordFailure(
    "files missing from their request ledger",
    reportList("file(s) carry a request but are not in its ledger", missingFromLedger, ({ request, file }) =>
      `${file.name} (request "${request.title}", by ${file.submission.submitterName || "unknown"})${file.isDeleted ? " (deleted)" : ""}`
    )
  );

  recordFailure(
    "request ledger counters",
    reportList("request(s) have counters that do not match their ledger", wrongCounters, ({ request, entries, uniqueNames }) =>
      `${request.title}: uploads ${request.uploadsCount || 0} vs ${entries} entries, submitters ${request.submittersCount || 0} vs ${uniqueNames} unique`
    )
  );

  // These are expected over time, so they are reported without failing the run
  if (legacyRequests.length) {
    const titles = legacyRequests
      .slice(0, MAX_LISTED)
      .map((request) => `"${request.title}"`)
      .join(", ");

    console.log(
      `\nInfo: ${legacyRequests.length} request(s) predate the submission ledger and keep their stored counters: ${titles}`
    );
  }

  if (deletedFileEntries) {
    console.log(`Info: ${deletedFileEntries} ledger entr(ies) refer to files that were permanently deleted.`);
  }

  if (preProvenanceEntries) {
    console.log(`Info: ${preProvenanceEntries} ledger entr(ies) refer to files uploaded before provenance was stored.`);
  }

  console.log("");

  if (failedChecks.length) {
    console.log(`${failedChecks.length} check(s) failed: ${failedChecks.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.log("All checks passed");
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
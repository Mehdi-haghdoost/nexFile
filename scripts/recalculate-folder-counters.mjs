
import mongoose from "mongoose";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const OWNER_ID = "69561f33a1a2918e240f1707";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL;

if (!uri) {
  throw new Error(
    "MongoDB connection string not found. Check your .env.local file."
  );
}

const objectId = (id) => new mongoose.Types.ObjectId(id);

async function main() {
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const folders = db.collection("folders");
  const files = db.collection("files");

  const owner = objectId(OWNER_ID);

  // Fetch every folder belonging to this user.
  const allFolders = await folders
    .find({ owner })
    .project({
      _id: 1,
      name: 1,
      parentFolder: 1,
      isDeleted: 1,
      filesCount: 1,
      subFoldersCount: 1,
      totalSize: 1,
    })
    .toArray();

  if (allFolders.length === 0) {
    console.log("No folders found for this owner.");
    return;
  }

  const folderById = new Map(
    allFolders.map((folder) => [
      folder._id.toString(),
      folder,
    ])
  );

  const updates = [];

  // Recalculate counters for every folder independently.
  for (const folder of allFolders) {
    const folderId = folder._id;
    const isDeleted = folder.isDeleted === true;

    const [fileStats, subFoldersCount] = await Promise.all([
      files
        .aggregate([
          {
            $match: {
              folder: folderId,
              owner,
              isDeleted: false,
            },
          },
          {
            $group: {
              _id: null,
              filesCount: { $sum: 1 },
              totalSize: { $sum: { $ifNull: ["$size", 0] } },
            },
          },
        ])
        .toArray(),

      folders.countDocuments({
        parentFolder: folderId,
        owner,
        isDeleted: false,
      }),
    ]);

    const stats = fileStats[0] || {
      filesCount: 0,
      totalSize: 0,
    };

    updates.push({
      _id: folderId,
      name: folder.name,
      isDeleted,
      before: {
        filesCount: folder.filesCount ?? 0,
        subFoldersCount: folder.subFoldersCount ?? 0,
        totalSize: folder.totalSize ?? 0,
      },
      after: {
        filesCount: stats.filesCount,
        subFoldersCount,
        totalSize: stats.totalSize,
      },
    });
  }

  console.log("\nCounter recalculation preview:\n");

  console.table(
    updates.map((item) => ({
      folder: item.name,
      id: item._id.toString(),
      deleted: item.isDeleted,
      oldFiles: item.before.filesCount,
      newFiles: item.after.filesCount,
      oldSubfolders: item.before.subFoldersCount,
      newSubfolders: item.after.subFoldersCount,
      oldSize: item.before.totalSize,
      newSize: item.after.totalSize,
    }))
  );

  const changed = updates.filter(
    (item) =>
      item.before.filesCount !== item.after.filesCount ||
      item.before.subFoldersCount !== item.after.subFoldersCount ||
      item.before.totalSize !== item.after.totalSize
  );

  console.log(`\nTotal folders scanned: ${updates.length}`);
  console.log(`Folders requiring counter updates: ${changed.length}`);

  if (!process.argv.includes("--apply")) {
    console.log("\nPREVIEW ONLY. No database changes were made.");
    console.log("Review the results before running with --apply.");
    return;
  }

  let modifiedCount = 0;

  for (const item of changed) {
    const result = await folders.updateOne(
      {
        _id: item._id,
        owner,
      },
      {
        $set: {
          filesCount: item.after.filesCount,
          subFoldersCount: item.after.subFoldersCount,
          totalSize: item.after.totalSize,
        },
      }
    );

    modifiedCount += result.modifiedCount;
  }

  console.log(`\nUpdated folder documents: ${modifiedCount}`);
  console.log("Counter recalculation completed.");
}

main()
  .catch((error) => {
    console.error("Counter recalculation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

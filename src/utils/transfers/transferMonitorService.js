import Transfer from "@/models/Transfer";
import TransferActivity from "@/models/TransferActivity";
import { buildShareLink, getTransferStatus } from "@/utils/transfers/transferService";

// The Activity tab shows the most recent events, newest first
export const ACTIVITY_FEED_LIMIT = 50;

// The Transfers tab summarises the most recently created transfers
export const TRANSFER_SUMMARY_LIMIT = 50;

// Caps the events read to count visitors, so one busy transfer cannot make the query unbounded
export const VISITOR_SCAN_LIMIT = 5000;

// A short, stable label from the keyed hash, which identifies nobody outside its transfer
const visitorLabel = (visitorHash) =>
  visitorHash ? `Visitor ${visitorHash.slice(0, 4)}` : "Visitor";

// One row per view or download, newest first, leaving out deleted transfers
export const getActivityRows = async (ownerId) => {
  const events = await TransferActivity.find({ owner: ownerId })
    .sort({ occurredAt: -1 })
    .limit(ACTIVITY_FEED_LIMIT)
    .populate({ path: "transfer", select: "groupName isDeleted" })
    .lean();

  return events
    .filter((event) => event.transfer && !event.transfer.isDeleted)
    .map((event) => ({
      id: event._id.toString(),
      transferId: event.transfer._id.toString(),
      transferName: event.transfer.groupName,
      kind: event.kind,
      fileName: event.fileName,
      visitor: visitorLabel(event.visitorHash),
      occurredAt: event.occurredAt,
    }));
};

// Same four states and priority as the transfer details page: removed files outrank how it expired
const getTransferState = (transfer) => {
  const status = getTransferStatus(transfer.expirationDate);
  if (transfer.filesPurgedAt) return "files_removed";
  if (status === "expired" && transfer.endedAt) return "ended";
  return status;
};

// Recorded views and downloads per transfer, counted in the database so no event cap applies
const countRecordedActivity = async (transferIds) => {
  // The ids come from the owner's own transfers, so they are already ObjectIds scoped to that owner
  const groups = await TransferActivity.aggregate([
    { $match: { transfer: { $in: transferIds }, kind: { $in: ["view", "download", "download_all"] } } },
    { $group: { _id: { transfer: "$transfer", kind: "$kind" }, count: { $sum: 1 } } },
  ]);

  // Folds the groups into one entry per transfer; a download-all counts as one download
  const counts = new Map();
  for (const { _id, count } of groups) {
    const key = _id.transfer.toString();
    const entry = counts.get(key) || { views: 0, downloads: 0 };
    if (_id.kind === "view") entry.views += count;
    else entry.downloads += count;
    counts.set(key, entry);
  }

  return counts;
};

// One row per transfer: recorded views and downloads, distinct visitors, latest activity, state and share link
export const getTransferRows = async (ownerId, { origin = "" } = {}) => {
  const transfers = await Transfer.find({ owner: ownerId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(TRANSFER_SUMMARY_LIMIT)
    .select("groupName token expirationDate endedAt filesPurgedAt createdAt")
    .lean();

  if (!transfers.length) return [];

  const transferIds = transfers.map((transfer) => transfer._id);

  // The capped scan still gives visitors and last activity; the totals come from the uncapped count
  const [events, recorded] = await Promise.all([
    TransferActivity.find({
      owner: ownerId,
      transfer: { $in: transferIds },
    })
      .sort({ occurredAt: -1 })
      .limit(VISITOR_SCAN_LIMIT)
      .select("transfer visitorHash occurredAt")
      .lean(),
    countRecordedActivity(transferIds),
  ]);

  // Collects each transfer's distinct visitors and its most recent event
  const byTransfer = new Map();

  for (const event of events) {
    const key = event.transfer.toString();
    const entry = byTransfer.get(key) || { visitors: new Set(), lastActivityAt: null };

    if (event.visitorHash) entry.visitors.add(event.visitorHash);
    if (!entry.lastActivityAt || event.occurredAt > entry.lastActivityAt) {
      entry.lastActivityAt = event.occurredAt;
    }

    byTransfer.set(key, entry);
  }

  return transfers
    .map((transfer) => {
      const entry = byTransfer.get(transfer._id.toString());
      const counts = recorded.get(transfer._id.toString());

      return {
        id: transfer._id.toString(),
        name: transfer.groupName,
        status: getTransferStatus(transfer.expirationDate),
        state: getTransferState(transfer),
        visitors: entry ? entry.visitors.size : 0,
        views: counts ? counts.views : 0,
        downloads: counts ? counts.downloads : 0,
        lastActivityAt: entry?.lastActivityAt || null,
        createdAt: transfer.createdAt,
        // Same link the Transfers page copies; the token itself is never sent on its own
        link: buildShareLink(transfer.token, origin),
      };
    })
    // Recent activity first; transfers nobody has opened fall back to their creation date
    .sort(
      (a, b) =>
        new Date(b.lastActivityAt || b.createdAt) - new Date(a.lastActivityAt || a.createdAt)
    );
};


// The summary cards count activity over this many recent days
export const SUMMARY_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

// Headline numbers for the summary cards: live transfers, plus recent views, downloads and visitors
export const getMonitorSummary = async (ownerId) => {
  const now = new Date();
  const since = new Date(now.getTime() - SUMMARY_WINDOW_DAYS * DAY_MS);

  // Only transfers that still exist and are not deleted contribute, matching the table
  const liveTransferIds = await Transfer.distinct("_id", { owner: ownerId, isDeleted: false });

  if (!liveTransferIds.length) {
    return { activeTransfers: 0, views: 0, downloads: 0, visitors: 0, windowDays: SUMMARY_WINDOW_DAYS };
  }

  const recentActivity = {
    owner: ownerId,
    transfer: { $in: liveTransferIds },
    occurredAt: { $gte: since },
  };

  const [activeTransfers, views, downloads, visitorHashes] = await Promise.all([
    // Same rule as getTransferStatus: the exact expiry moment already counts as expired
    Transfer.countDocuments({ owner: ownerId, isDeleted: false, expirationDate: { $gt: now } }),
    TransferActivity.countDocuments({ ...recentActivity, kind: "view" }),
    // A download-all is one action, however many files it contained
    TransferActivity.countDocuments({ ...recentActivity, kind: { $in: ["download", "download_all"] } }),
    // Hashes are keyed per transfer, so one person on two transfers counts as two visitors
    TransferActivity.distinct("visitorHash", { ...recentActivity, visitorHash: { $ne: null } }),
  ]);

  return {
    activeTransfers,
    views,
    downloads,
    visitors: visitorHashes.length,
    windowDays: SUMMARY_WINDOW_DAYS,
  };
};
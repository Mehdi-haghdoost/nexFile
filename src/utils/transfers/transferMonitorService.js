import Transfer from "@/models/Transfer";
import TransferActivity from "@/models/TransferActivity";
import { getTransferStatus } from "@/utils/transfers/transferService";

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

// One row per transfer: its counters, distinct visitors and latest activity
export const getTransferRows = async (ownerId) => {
  const transfers = await Transfer.find({ owner: ownerId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(TRANSFER_SUMMARY_LIMIT)
    .select("groupName expirationDate viewCount downloadCount createdAt")
    .lean();

  if (!transfers.length) return [];

  const events = await TransferActivity.find({
    owner: ownerId,
    transfer: { $in: transfers.map((transfer) => transfer._id) },
  })
    .sort({ occurredAt: -1 })
    .limit(VISITOR_SCAN_LIMIT)
    .select("transfer visitorHash occurredAt")
    .lean();

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

      return {
        id: transfer._id.toString(),
        name: transfer.groupName,
        status: getTransferStatus(transfer.expirationDate),
        visitors: entry ? entry.visitors.size : 0,
        views: transfer.viewCount || 0,
        downloads: transfer.downloadCount || 0,
        lastActivityAt: entry?.lastActivityAt || null,
        createdAt: transfer.createdAt,
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
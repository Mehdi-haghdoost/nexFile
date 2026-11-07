import mongoose from "mongoose";
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

// A live transfer expiring within this many days counts as expiring soon
export const ATTENTION_EXPIRING_DAYS = 3;

// A transfer must be this many hours old before having no views counts as never opened
export const ATTENTION_UNOPENED_HOURS = 24;

// Most items the Needs attention list shows at once
export const ATTENTION_ITEM_LIMIT = 5;

const HOUR_MS = 60 * 60 * 1000;

// Most urgent reason first; a transfer is listed once, under its most urgent reason
const ATTENTION_PRIORITY = { delivery_failed: 0, expiring_soon: 1, never_opened: 2 };

// Within a reason, the most pressing transfer first: never opened by age, the rest by expiry
const compareAttention = (a, b) => {
  const byPriority = ATTENTION_PRIORITY[a.reason] - ATTENTION_PRIORITY[b.reason];
  if (byPriority) return byPriority;

  if (a.reason === "never_opened") return new Date(a.createdAt) - new Date(b.createdAt);
  return new Date(a.expiresAt) - new Date(b.expiresAt);
};

// Live transfers the owner should act on: failed emails, expiring soon, or never opened
export const getAttentionItems = async (ownerId, { origin = "", now = new Date() } = {}) => {
  const [totalTransfers, liveTransfers] = await Promise.all([
    Transfer.countDocuments({ owner: ownerId, isDeleted: false }),
    // Same rule as getTransferStatus: the exact expiry moment already counts as expired
    Transfer.find({
      owner: ownerId,
      isDeleted: false,
      expirationDate: { $gt: now },
      filesPurgedAt: null,
    })
      .select("groupName token expirationDate createdAt recipients.status")
      .lean(),
  ]);

  if (!liveTransfers.length) return { items: [], total: 0, totalTransfers };

  const expiringBefore = now.getTime() + ATTENTION_EXPIRING_DAYS * DAY_MS;
  const sentBefore = now.getTime() - ATTENTION_UNOPENED_HOURS * HOUR_MS;

  // Only transfers old enough to count as never opened need their views looked up
  const unopenedCandidates = liveTransfers
    .filter((transfer) => new Date(transfer.createdAt).getTime() <= sentBefore)
    .map((transfer) => transfer._id);

  // Recorded views, the same events the Views column counts
  const viewedIds = unopenedCandidates.length
    ? await TransferActivity.distinct("transfer", {
        transfer: { $in: unopenedCandidates },
        kind: "view",
      })
    : [];
  const viewed = new Set(viewedIds.map((id) => id.toString()));

  const matches = [];

  for (const transfer of liveTransfers) {
    const id = transfer._id.toString();
    const failedCount = (transfer.recipients || []).filter((recipient) => recipient.status === "failed").length;
    const expiresAt = new Date(transfer.expirationDate).getTime();
    const isOldEnough = new Date(transfer.createdAt).getTime() <= sentBefore;

    let reason = null;
    if (failedCount > 0) reason = "delivery_failed";
    else if (expiresAt <= expiringBefore) reason = "expiring_soon";
    else if (isOldEnough && !viewed.has(id)) reason = "never_opened";

    if (!reason) continue;

    matches.push({
      id,
      name: transfer.groupName,
      reason,
      expiresAt: transfer.expirationDate,
      createdAt: transfer.createdAt,
      failedCount,
      // Same link the Transfers page copies; the token itself is never sent on its own
      link: buildShareLink(transfer.token, origin),
    });
  }

  matches.sort(compareAttention);

  return { items: matches.slice(0, ATTENTION_ITEM_LIMIT), total: matches.length, totalTransfers };
};


// Events per page of a transfer's activity timeline on its details page
export const TRANSFER_ACTIVITY_PAGE_SIZE = 20;

// Recorded figures for one transfer, counted in the database so busy transfers have no event cap
export const getTransferActivityStats = async (transfer) => {
  const transferId = transfer._id;

  const [kindGroups, visitorGroups, fileGroups, latest] = await Promise.all([
    TransferActivity.aggregate([
      { $match: { transfer: transferId } },
      { $group: { _id: "$kind", count: { $sum: 1 } } },
    ]),
    // Hashes are keyed per transfer, so each distinct hash is one visitor of this transfer
    TransferActivity.aggregate([
      { $match: { transfer: transferId, visitorHash: { $ne: null } } },
      { $group: { _id: "$visitorHash" } },
      { $count: "visitors" },
    ]),
    // Only single-file downloads name their file; a download-all delivers every file at once
    TransferActivity.aggregate([
      { $match: { transfer: transferId, kind: "download", fileName: { $ne: null } } },
      { $group: { _id: "$fileName", count: { $sum: 1 } } },
    ]),
    TransferActivity.findOne({ transfer: transferId }).sort({ occurredAt: -1 }).select("occurredAt").lean(),
  ]);

  const byKind = Object.fromEntries(kindGroups.map(({ _id, count }) => [_id, count]));
  const singleByName = new Map(fileGroups.map(({ _id, count }) => [_id, count]));
  const downloadAll = byKind.download_all || 0;

  return {
    // Same definitions as the Monitor: one view per visitor every 30 minutes, a download-all counts once
    views: byKind.view || 0,
    downloads: (byKind.download || 0) + downloadAll,
    downloadAll,
    visitors: visitorGroups[0]?.visitors || 0,
    lastActivityAt: latest?.occurredAt || null,
    // In the transfer's own file order, counting every download that delivered each file
    files: (transfer.files || []).map((file) => ({
      name: file.name,
      downloads: (singleByName.get(file.name) || 0) + downloadAll,
      viaDownloadAll: downloadAll,
    })),
  };
};

// The position after the last event shown, so the next page neither skips nor repeats ties
const encodeActivityCursor = (event) => `${new Date(event.occurredAt).getTime()}_${event._id.toString()}`;

// Reads a cursor from the client, or null when it is not one this service produced
export const parseActivityCursor = (value) => {
  const match = /^(\d{1,15})_([a-f0-9]{24})$/i.exec(String(value || ""));
  if (!match) return null;

  return {
    occurredAt: new Date(Number(match[1])),
    id: new mongoose.Types.ObjectId(match[2]),
  };
};

// One page of a transfer's views and downloads, newest first, without exposing visitor hashes
export const getTransferActivityPage = async (transferId, { before = null, limit = TRANSFER_ACTIVITY_PAGE_SIZE } = {}) => {
  const filter = { transfer: transferId };

  // Older than the cursor, with the id breaking ties between events at the same moment
  if (before) {
    filter.$or = [
      { occurredAt: { $lt: before.occurredAt } },
      { occurredAt: before.occurredAt, _id: { $lt: before.id } },
    ];
  }

  // One extra event shows whether an older page exists
  const events = await TransferActivity.find(filter)
    .sort({ occurredAt: -1, _id: -1 })
    .limit(limit + 1)
    .select("kind fileName visitorHash occurredAt")
    .lean();

  const page = events.slice(0, limit);

  return {
    events: page.map((event) => ({
      id: event._id.toString(),
      kind: event.kind,
      fileName: event.fileName || null,
      visitor: visitorLabel(event.visitorHash),
      occurredAt: event.occurredAt,
    })),
    nextCursor: events.length > limit ? encodeActivityCursor(page[page.length - 1]) : null,
  };
};
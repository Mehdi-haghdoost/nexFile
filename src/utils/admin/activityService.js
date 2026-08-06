import ActivityLog from "@/models/ActivityLog";

export class ActivityService {
  // Record an activity. Never throws: logging must not break the action
  // that triggered it.
  static async log(organizationId, actorId, { action, description, category, ipAddress }) {
    try {
      if (!organizationId || !actorId) return null;

      return await ActivityLog.create({
        organization: organizationId,
        actor: actorId,
        action,
        description,
        category: category || "General",
        ipAddress: ipAddress || null,
      });
    } catch (error) {
      console.error("Activity log error:", error);
      return null;
    }
  }

  // List an organization's activity, shaped for the activity table
  static async listActivity(orgId, { category = "all", limit = 100 } = {}) {
    const query = { organization: orgId };
    if (category !== "all") {
      query.category = category;
    }

    const logs = await ActivityLog.find(query)
      .populate({ path: "actor", select: "name email image" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return logs
      .filter((l) => l.actor)
      .map((l) => ({
        id: l._id.toString(),
        activity: l.description,
        category: l.category,
        createdAt: l.createdAt,
        location: l.ipAddress || "Unknown",
        person: {
          name: l.actor.name || l.actor.email,
          avatar: l.actor.image || null,
        },
      }));
  }

  // Delete all activity for an organization
  static async clearActivity(orgId) {
    const result = await ActivityLog.deleteMany({ organization: orgId });
    return result.deletedCount;
  }
}
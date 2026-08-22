import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import Organization from "@/models/Organization";
import User from "@/models/User";
import {
  SETTINGS_FEATURE_KEYS,
  SETTINGS_POLICY_KEYS,
  SETTINGS_LANGUAGES,
  DEFAULT_LANGUAGE,
  MAX_TEAM_NAME_LENGTH,
} from "@/utils/constants/settingsConstants";

const toFlags = (source = {}, keys) =>
  keys.reduce((acc, key) => {
    acc[key] = Boolean(source[key]);
    return acc;
  }, {});

/** Normalises a stored settings document, filling any missing defaults. */
const pickSettings = (org) => ({
  name: org.name,
  language: org?.settings?.language || DEFAULT_LANGUAGE,
  logoUrl: org?.settings?.logoUrl || null,
  features: toFlags(org?.settings?.features, SETTINGS_FEATURE_KEYS),
  policies: toFlags(org?.settings?.policies, SETTINGS_POLICY_KEYS),
});

// GET /api/admin/settings
export async function GET(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId).select("name");
    const org = await OrganizationService.resolveOrgContext(userId, user?.name);

    const isAdmin = await OrganizationService.isOrgAdmin(org._id, userId);

    return NextResponse.json(
      { success: true, settings: pickSettings(org), isAdmin },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/settings
// body: { name?, language?, features?: {...}, policies?: {...} }
export async function PATCH(request) {
  try {
    await connectDB();

    const { userId, response } = requireUser(request);
    if (response) return response;

    const user = await User.findById(userId).select("name");
    const orgContext = await OrganizationService.resolveOrgContext(userId, user?.name);

    const isAdmin = await OrganizationService.isOrgAdmin(orgContext._id, userId);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admins can change team settings" },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const org = await Organization.findById(orgContext._id);
    const changed = [];

    if (updates.name !== undefined) {
      const name = String(updates.name).trim();

      if (!name) {
        return NextResponse.json(
          { success: false, message: "Team name is required" },
          { status: 400 }
        );
      }

      if (name.length > MAX_TEAM_NAME_LENGTH) {
        return NextResponse.json(
          { success: false, message: `Team name must not exceed ${MAX_TEAM_NAME_LENGTH} characters` },
          { status: 400 }
        );
      }

      org.name = name;
      changed.push("name");
    }

    if (!org.settings) org.settings = {};

    if (updates.language !== undefined) {
      const allowed = SETTINGS_LANGUAGES.some((l) => l.id === updates.language);

      if (!allowed) {
        return NextResponse.json(
          { success: false, message: "Unsupported language" },
          { status: 400 }
        );
      }

      org.settings.language = updates.language;
      changed.push("language");
    }

    // Only known keys are written, so an unexpected field cannot be injected
    const applyGroup = (group, allowedKeys) => {
      if (!updates[group] || typeof updates[group] !== "object") return;
      if (!org.settings[group]) org.settings[group] = {};

      for (const key of allowedKeys) {
        if (updates[group][key] !== undefined) {
          org.settings[group][key] = Boolean(updates[group][key]);
          changed.push(key);
        }
      }
    };

    applyGroup("features", SETTINGS_FEATURE_KEYS);
    applyGroup("policies", SETTINGS_POLICY_KEYS);

    if (changed.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid settings provided" },
        { status: 400 }
      );
    }

    org.markModified("settings");
    await org.save();

    // Enforcing two-step verification changes who can sign in, so it belongs
    // under Security rather than the general log.
    const category = changed.includes("enforceTwoFactor") ? "Security" : "General";

    await ActivityService.log(org._id, userId, {
      action: "settings.updated",
      description: `Updated team settings: ${changed.join(", ")}`,
      category,
    });

    return NextResponse.json(
      { success: true, settings: pickSettings(org) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
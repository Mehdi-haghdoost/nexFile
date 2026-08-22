import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireUser } from "@/utils/auth/requireUser";
import { OrganizationService } from "@/utils/admin/organizationService";
import { ActivityService } from "@/utils/admin/activityService";
import Organization from "@/models/Organization";
import User from "@/models/User";
import {
  SETTINGS_FEATURE_KEYS,
  SETTINGS_LANGUAGES,
  DEFAULT_LANGUAGE,
  MAX_TEAM_NAME_LENGTH,
} from "@/utils/constants/settingsConstants";

/** Normalises a stored settings document, filling any missing defaults. */
const pickSettings = (org) => {
  const features = org?.settings?.features || {};

  return {
    name: org.name,
    language: org?.settings?.language || DEFAULT_LANGUAGE,
    logoUrl: org?.settings?.logoUrl || null,
    features: SETTINGS_FEATURE_KEYS.reduce((acc, key) => {
      acc[key] = Boolean(features[key]);
      return acc;
    }, {}),
  };
};

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
// body: { name?, language?, features?: { [key]: boolean } }
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

    if (updates.features && typeof updates.features === "object") {
      if (!org.settings.features) org.settings.features = {};

      // Only known keys are written, so an unexpected field cannot be injected
      for (const key of SETTINGS_FEATURE_KEYS) {
        if (updates.features[key] !== undefined) {
          org.settings.features[key] = Boolean(updates.features[key]);
          changed.push(key);
        }
      }
    }

    if (changed.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid settings provided" },
        { status: 400 }
      );
    }

    org.markModified("settings");
    await org.save();

    await ActivityService.log(org._id, userId, {
      action: "settings.updated",
      description: `Updated team settings: ${changed.join(", ")}`,
      category: "General",
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
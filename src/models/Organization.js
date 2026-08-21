import mongoose from "mongoose";
import { PLAN_IDS, DEFAULT_PLAN_ID, BILLING_CYCLES, BILLING_STATUS } from "@/utils/constants/billingConstants";

// Only the display fields of a card are stored. Full card numbers are never
// persisted, even in this simulated flow.
const PaymentMethodSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    last4: { type: String, required: true, maxlength: 4 },
    expMonth: { type: Number, required: true, min: 1, max: 12 },
    expYear: { type: Number, required: true },
    holderName: { type: String, default: "" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    // One owned organization per user, in this simplified model
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: PLAN_IDS,
      default: DEFAULT_PLAN_ID,
    },
    billing: {
      cycle: {
        type: String,
        enum: Object.values(BILLING_CYCLES),
        default: BILLING_CYCLES.MONTHLY,
      },
      status: {
        type: String,
        enum: Object.values(BILLING_STATUS),
        default: BILLING_STATUS.TRIALING,
      },
      trialEndsAt: { type: Date, default: null },
      currentPeriodEnd: { type: Date, default: null },
      paymentMethod: { type: PaymentMethodSchema, default: null },
      // Billing contact details shown on the Information tab
      contact: {
        companyName: { type: String, default: "" },
        email: { type: String, default: "" },
        taxId: { type: String, default: "" },
        addressLine: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" },
      },
    },
    // Organization-wide security settings shown in the admin console
    security: {
      twoStepVerification: { type: Boolean, default: false },
      linkPassword: { type: Boolean, default: false },
      linkExpiration: { type: Boolean, default: false },
      externalSharing: {
        type: String,
        enum: ["Email and link", "Email only", "Link only", "Disabled"],
        default: "Email and link",
      },
    },
  },
  { timestamps: true }
);

const Organization =
  mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);

export default Organization;
import mongoose from "mongoose";

const SignatureSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    
    type: {
      type: String,
      enum: ["draw", "type", "upload"],
      required: true,
    },
    
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    
    cloudinaryId: {
      type: String,
      default: null,
    },
    
    cloudinaryUrl: {
      type: String,
      default: null,
    },
    
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

SignatureSchema.index({ owner: 1, createdAt: -1 });
SignatureSchema.index({ owner: 1, isDefault: 1 });

// Pre-save hook: Set only one signature as default
SignatureSchema.pre("save", async function () {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose
      .model("Signature")
      .updateMany(
        { owner: this.owner, _id: { $ne: this._id }, isDefault: true },
        { isDefault: false }
      );
  }
});

SignatureSchema.statics.countByOwner = async function(ownerId) {
  return await this.countDocuments({ owner: ownerId });
};

const Signature = mongoose.models.Signature || mongoose.model("Signature", SignatureSchema);

export default Signature;
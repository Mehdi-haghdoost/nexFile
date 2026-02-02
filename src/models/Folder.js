// import mongoose from "mongoose";

// const FolderSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Folder name is required"],
//       trim: true,
//       maxlength: [100, "Folder name cannot exceed 100 characters"],
//     },

//     description: {
//       type: String,
//       trim: true,
//       maxlength: [500, "Description cannot exceed 500 characters"],
//       default: "",
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Folder owner is required"],
//       index: true,
//     },

//     parentFolder: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Folder",
//       default: null,
//       index: true,
//     },

//     accessType: {
//       type: String,
//       enum: ["regular", "specific"],
//       default: "regular",
//     },

//     sharedWith: [
//       {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         permission: {
//           type: String,
//           enum: ["view", "edit", "admin"],
//           default: "view",
//         },
//         sharedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],

//     color: {
//       type: String,
//       default: "#4C3CC6",
//     },

//     icon: {
//       type: String,
//       default: "folder",
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     deletedAt: {
//       type: Date,
//       default: null,
//     },

//     isArchived: {
//       type: Boolean,
//       default: false,
//     },

//     isStarred: {
//       type: Boolean,
//       default: false,
//     },

//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     filesCount: {
//       type: Number,
//       default: 0,
//     },

//     subFoldersCount: {
//       type: Number,
//       default: 0,
//     },

//     totalSize: {
//       type: Number,
//       default: 0,
//     },

//     lastActivity: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// FolderSchema.index({ owner: 1, isDeleted: 1 });
// FolderSchema.index({ owner: 1, parentFolder: 1 });
// FolderSchema.index({ name: "text", description: "text" });

// const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);

// export default Folder;

import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: [100, "Folder name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Folder owner is required"],
      index: true,
    },

    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },

    accessType: {
      type: String,
      enum: ["regular", "specific"],
      default: "regular",
    },

    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit", "admin"],
          default: "view",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ NEW: Permissions Management
    permissions: {
      controlLevel: {
        type: String,
        enum: ['folder-member', 'only-owner', 'admins-only'],
        default: 'folder-member',
      },
      showAccessInfo: {
        type: Boolean,
        default: false,
      },
    },

    // ✅ NEW: Share Link Configuration
    shareLink: {
      url: {
        type: String,
        default: null,
      },
      accessLevel: {
        type: String,
        enum: ['anyone', 'invited', 'team'],
        default: 'anyone',
      },
      isExpirationEnabled: {
        type: Boolean,
        default: false,
      },
      expirationDate: {
        type: Date,
        default: null,
      },
      isPasswordEnabled: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        default: null,
      },
      disableDownloads: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },

    color: {
      type: String,
      default: "#4C3CC6",
    },

    icon: {
      type: String,
      default: "folder",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isStarred: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    filesCount: {
      type: Number,
      default: 0,
    },

    subFoldersCount: {
      type: Number,
      default: 0,
    },

    totalSize: {
      type: Number,
      default: 0,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FolderSchema.index({ owner: 1, isDeleted: 1 });
FolderSchema.index({ owner: 1, parentFolder: 1 });
FolderSchema.index({ name: "text", description: "text" });

// ✅ NEW: Index for share link expiration queries
FolderSchema.index({ "shareLink.isExpirationEnabled": 1, "shareLink.expirationDate": 1 });

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);

export default Folder;
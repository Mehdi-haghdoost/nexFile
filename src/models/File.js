// import mongoose from "mongoose";

// const FileSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "File name is required"],
//       trim: true,
//       maxlength: [255, "File name cannot exceed 255 characters"],
//     },

//     originalName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     mimeType: {
//       type: String,
//       required: true,
//     },

//     size: {
//       type: Number,
//       required: true,
//     },

//     extension: {
//       type: String,
//       required: true,
//       lowercase: true,
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "File owner is required"],
//       index: true,
//     },

//     folder: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Folder",
//       default: null,
//       index: true,
//     },

//     // Cloudinary fields
//     cloudinaryId: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     url: {
//       type: String,
//       required: true,
//     },

//     secureUrl: {
//       type: String,
//       required: true,
//     },

//     // Legacy fields (kept for backward compatibility)
//     path: {
//       type: String,
//       default: null,
//     },

//     thumbnailUrl: {
//       type: String,
//       default: null,
//     },

//     isPublic: {
//       type: Boolean,
//       default: false,
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

//     isDeleted: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     deletedAt: {
//       type: Date,
//       default: null,
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

//     version: {
//       type: Number,
//       default: 1,
//     },

//     downloadCount: {
//       type: Number,
//       default: 0,
//     },

//     lastDownloadedAt: {
//       type: Date,
//       default: null,
//     },

//     metadata: {
//       width: Number,
//       height: Number,
//       duration: Number,
//       pageCount: Number,
//       format: String,
//       resourceType: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// FileSchema.index({ owner: 1, isDeleted: 1 });
// FileSchema.index({ owner: 1, folder: 1 });
// FileSchema.index({ name: "text" });

// const File = mongoose.models.File || mongoose.model("File", FileSchema);

// export default File;

import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
      maxlength: [255, "File name cannot exceed 255 characters"],
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    extension: {
      type: String,
      required: true,
      lowercase: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "File owner is required"],
      index: true,
    },

    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },

    // Cloudinary fields
    cloudinaryId: {
      type: String,
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
    },

    secureUrl: {
      type: String,
      required: true,
    },

    // Legacy fields (kept for backward compatibility)
    path: {
      type: String,
      default: null,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: false,
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

    //  Permissions Management
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

    //  Share Link Configuration
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

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
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

    version: {
      type: Number,
      default: 1,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    lastDownloadedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      width: Number,
      height: Number,
      duration: Number,
      pageCount: Number,
      format: String,
      resourceType: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FileSchema.index({ owner: 1, isDeleted: 1 });
FileSchema.index({ owner: 1, folder: 1 });
FileSchema.index({ name: "text" });

//  Index for share link expiration queries
FileSchema.index({ "shareLink.isExpirationEnabled": 1, "shareLink.expirationDate": 1 });

const File = mongoose.models.File || mongoose.model("File", FileSchema);

export default File;
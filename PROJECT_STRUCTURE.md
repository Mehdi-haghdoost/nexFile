# 📁 Project Structure

Complete directory structure and organization of nexFile project.

## 📋 Table of Contents

- [Overview](#-overview)
- [Directory Structure](#-directory-structure)
- [Core Directories](#️-core-directories)
- [Key Architectural Patterns](#-key-architectural-patterns)
- [Security Considerations](#-security-considerations)

## 🎯 Overview

nexFile follows Next.js 15 App Router architecture with a clean separation of concerns:
- **App Router** (`src/app/`) - Pages and API routes
- **Components** (`src/components/`) - Reusable UI components
- **Hooks** (`src/hooks/`) - Custom React hooks
- **Store** (`src/store/`) - Zustand state management
- **Lib** (`src/lib/`) - Core infrastructure
- **Utils** (`src/utils/`) - Helper functions and domain services
- **Models** (`src/models/`) - Mongoose database schemas

## 📂 Directory Structure
```
nexFile/
├── public/                      # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Core infrastructure
│   ├── models/                 # Database models
│   ├── store/                  # State management
│   ├── styles/                 # CSS modules
│   ├── utils/                  # Helpers and services
│   └── __tests__/              # Integration tests
├── .env.local                  # Environment variables (gitignored)
├── middleware.js               # Next.js middleware
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind CSS config
├── DEVELOPMENT.md              # Development notes
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Project documentation
```

## 🗂️ Core Directories

### `/src/app/` - Application Routes

#### Pages
```
app/
├── page.js                     # Landing page
├── layout.js                   # Root layout
├── home/                       # Main application
├── login-register/             # Authentication pages (step-based)
├── folder/                     # Folder view page
├── invite/[token]/             # Accept an organization invite
├── request/[token]/            # Public file-request landing page
├── paper-doc/[fileId]/         # Document editor
├── pdf-editor/                 # PDF editing interface
└── transfer/                   # File transfer page
```

The auth page is a **single route with steps** rather than several routes:
`login`, `register`, `forget`, `reset`, `reset-success`, `two-factor`,
`two-factor-setup`, `recovery`.

#### API Routes
```
app/api/
├── auth/
│   ├── register/               # User registration
│   ├── login/                  # Password step; may return a challenge
│   ├── logout/                 # Deletes the refresh token
│   ├── me/                     # Get current user
│   ├── refresh/                # Rotate tokens
│   ├── forgot-password/        # Request password reset
│   ├── reset-password/         # Reset password with token
│   ├── set-password/           # Set or change password while signed in
│   ├── verify-password/        # Confirm the current password
│   ├── security-status/        # Personal security state
│   ├── oauth-session/          # Exchange a provider session for app cookies
│   ├── two-factor/
│   │   ├── setup/              # Issue a pending secret and QR
│   │   ├── enable/             # Confirm a code and activate
│   │   ├── disable/            # Remove, password required
│   │   ├── challenge/          # Second login step
│   │   ├── backup-codes/       # Regenerate, password required
│   │   └── recovery/
│   │       ├── request/        # Email a recovery link
│   │       └── confirm/        # Consume the link, disable 2FA
│   └── [...nextauth]/          # Auth.js handlers (Google)
│
├── admin/
│   ├── organization/           # Organization context
│   ├── members/                # Membership management
│   ├── groups/                 # Group management
│   ├── invites/                # Invite lifecycle
│   ├── content/                # Org-wide content view
│   ├── security/               # Link policies
│   ├── settings/               # Team settings, features, policies
│   └── activity/               # Activity log and export
│
├── files/
│   ├── route.js                # List and delete
│   ├── upload/                 # Upload endpoint
│   ├── create/                 # Create a blank document
│   ├── deleted/                # Trash
│   ├── shared/                 # Shared with me
│   ├── suggested/              # Recent activity
│   ├── monitor/                # Send and monitor analytics
│   ├── request/                # File requests
│   ├── paper/[fileId]/         # Document content
│   └── [id]/                   # copy, move, share, star, restore,
│                               # permanent, permissions
│
├── folders/                    # Folder CRUD, copy, move
├── signatures/                 # Signature CRUD and apply
├── public/request/[token]/     # Unauthenticated upload target
└── users/search/               # Search users for sharing
```

### `/src/components/` - UI Components

```
components/
├── layouts/                    # Page structure
│   ├── Admin/                  # Admin console layout
│   ├── Auth/                   # Authentication layout
│   ├── Folder/                 # Folder view layout
│   ├── Home/                   # Main app layout, sidebar, navbar
│   ├── Modal/                  # BaseModal + ModalManager
│   └── pdf-editor/             # PDF editor layout
│
├── modules/                    # Feature components
│   ├── admin-console/          # billing, security, settings, members,
│   │                           # groups, dashboard, contentManagement
│   ├── home/                   # Action buttons, dropdowns, file rows
│   ├── login-register/         # Auth cards and footer
│   ├── Modals/                 # Every dialog in the app
│   └── paper-doc/              # Document editor modules
│
├── templates/                  # Complete page sections
│   ├── home/                   # admin-console, allFolder, shared,
│   │                           # deleted-files, file-requests,
│   │                           # send-and-monitor, signatures
│   ├── login-register/         # Login, Register, ForgetPassword,
│   │                           # ResetPassword, TwoFactorChallenge,
│   │                           # TwoFactorEnrolment, TwoFactorRecovery
│   ├── pdf-editor/             # PDF editor UI
│   └── transfer/               # Transfer page sections
│
└── ui/                         # Shared primitives
    ├── FileIcon.js             # File type icons
    ├── icons.js                # All SVG icons
    ├── PasswordRequirements.jsx
    ├── PasswordStrengthIndicator.jsx
    ├── Switch.js               # Toggle switch
    ├── SortDropdown/
    └── signatureFonts.js
```

#### Modal pattern

Every dialog follows the same three pieces:

1. `modalStore` holds `{ isOpen, data }` keyed by name
2. `ModalManager` renders all modals once, globally
3. Each modal reads its own slice and stays **presentational**

Because modals render globally, handlers travel through `data` rather than
props — otherwise each modal would have to run its own copy of a data hook and
fire duplicate requests on every page.

```javascript
openModal('setPassword', { hasPassword, onSubmit: setPassword });
```

### `/src/hooks/` - Custom React Hooks

```
hooks/
├── auth/
│   ├── useAuth.js              # Session check and proactive refresh
│   ├── useLogin.js             # Login form logic
│   ├── useRegister.js          # Registration logic
│   ├── useLogout.js            # Logout
│   ├── useForgetPassword.js    # Forgot password flow
│   ├── useResetPassword.js     # Reset password logic
│   ├── useOAuthBridge.js       # Completes a Google sign-in
│   ├── usePersonalSecurity.js  # Password and 2FA for the current user
│   └── useTwoFactorChallenge.js # Code step, enrolment, recovery
│
├── admin/
│   ├── useMembers.js           # Membership management
│   ├── useGroups.js            # Group management
│   ├── useContent.js           # Org-wide content
│   ├── useActivity.js          # Activity log
│   ├── useSecurity.js          # Link policies
│   ├── useBilling.js           # Plan and usage
│   └── useSettings.js          # Team settings and policies
│
├── files/
│   ├── fileUpload/             # Upload logic and modal state
│   ├── filesManagement/        # File CRUD and actions
│   ├── FileRequestModal/       # File request form and submit
│   ├── fileRequests/           # File requests list
│   ├── sharedFiles/            # Shared with me
│   ├── suggestedFiles/         # Recent activity
│   ├── monitor/                # Send and monitor data
│   └── createFileModal/        # Folder picker for new documents
│
├── folders/                    # Create and list folders
├── shareModal/                 # Share dialog state and actions
├── signatures/                 # Signature CRUD
├── createTransferModal/        # File transfer logic
├── canvas/                     # Canvas dark mode
└── useSorting.js               # Generic sorting hook
```

### `/src/store/` - Zustand State Management

```
store/
├── auth/
│   └── authStore.js            # Current user
│
├── features/
│   ├── files/filesStore.js
│   ├── folders/foldersStore.js # Also owns folder fetching + dedup
│   ├── billing/billingStore.js # Plan, usage, active tab
│   ├── settings/settingsStore.js # Team settings, optimistic updates
│   ├── monitor/monitorStore.js
│   ├── pdf-editor/pdfEditorStore.js
│   ├── signatures/signaturesStore.js
│   └── transfer/transferStore.js
│
├── ui/
│   ├── modalStore.js           # Modal visibility and payload
│   ├── dropdownStore.js
│   ├── filterStore.js
│   ├── searchStore.js
│   ├── sortStore.js
│   └── viewModeStore.js
│
└── index.js                    # Barrel exports
```

**Request deduplication** lives in the stores, not the hooks. An in-flight map
outside the zustand state means concurrent callers share one network call without
triggering re-renders:

```javascript
let inFlightRequest = null;   // module scope, not store state
```

> ⚠️ Zustand stores are **module singletons**. On the server they are shared
> across requests, so never read user state from a store during server render.

### `/src/lib/` - Core Infrastructure

```
lib/
├── mongodb.js                  # MongoDB connection
├── auth.js                     # Auth.js v5 config (Google provider)
├── fetchWithAuth.js            # Authenticated fetch + shared refresh lock
├── cloudinary.js               # File storage client
├── emailService.js             # Nodemailer transport and templates
├── toast.js                    # Toast notifications
└── sweetAlert.js               # Confirm dialogs
```

`auth.js` holds the NextAuth config so `auth()` can be imported by server code
without pulling in the route handler. The route file only re-exports handlers.

### `/src/models/` - Database Models

```
models/
├── User.js                     # Account + TOTP state
├── Organization.js             # Plan, billing, settings, security
├── Membership.js               # User ↔ organization link
├── Invite.js                   # Pending invitations
├── Group.js                    # Member groups
├── File.js                     # File metadata + share link config
├── Folder.js                   # Folder hierarchy
├── FileRequest.js              # Public upload requests
├── FileView.js                 # View tracking for analytics
├── Signature.js                # Saved signatures
├── ActivityLog.js              # Audit trail
├── RefreshToken.js             # Sessions with rotation tracking
├── PasswordReset.js            # Password reset tokens
└── TwoFactorRecovery.js        # 2FA recovery tokens
```

Fields holding secrets (`twoFactorSecret`, `twoFactorBackupCodes`) are
`select: false`, so a plain `findById()` elsewhere in the app cannot leak them.

> ⚠️ Mongoose projections: naming a field **without** a `+` prefix makes the
> projection inclusive and drops everything else. Mixing the two styles silently
> removes fields you did not list.

### `/src/utils/` - Helpers and Services

```
utils/
├── auth/
│   ├── tokenManager.js         # JWT lifetimes, cookies, rotation
│   ├── twoFactor.js            # TOTP, backup codes, challenge tokens
│   ├── requireUser.js          # Route guards
│   ├── hashPassword.js         # Password hashing
│   ├── validators.js           # Zod schemas and field validators
│   └── __tests__/
│
├── admin/
│   ├── organizationService.js  # Org context resolution
│   ├── membershipService.js    # Membership operations
│   ├── groupService.js         # Group operations
│   ├── inviteService.js        # Invite lifecycle
│   ├── contentService.js       # Org-wide content queries
│   ├── billingService.js       # Usage queries and cost summary
│   └── activityService.js      # Audit logging
│
├── files/
│   ├── fileService.js          # File operations
│   ├── fileValidators.js       # File validation
│   └── linkPolicy.js           # Share link policy enforcement
│
├── folders/                    # Folder service, helpers, validation
├── fileRequests/               # File request service
├── monitor/                    # Analytics service
├── helpers/                    # filter, search, sort, time
├── constants/                  # Per-feature constant modules
├── billingUtils.js             # Currency and date formatting
├── Storageutils.js             # Byte formatting and percentages
├── Licenseutils.js             # Seat calculations
├── clipboard.js
├── passwordUtils.js
├── formScroll.js
├── fileRequestUtils.js
└── validators.js
```

**Services** hold database logic and are imported by API routes. **Utils** are
pure functions safe to import from anywhere.

### `/src/__tests__/` - Testing

```
__tests__/
└── integration/
    └── auth/
        ├── complete-auth-journey.test.jsx
        ├── forgot-password-flow.test.jsx
        ├── login-flow.test.jsx
        ├── registration-flow.test.jsx
        ├── reset-password-flow.test.jsx
        └── reset-success-flow.test.jsx
```

API route tests live beside their routes in `__tests__/` folders.

## 🎨 Styling Organization
```
src/styles/
├── home/home.module.css
├── pdf-editor/pdf-editor.module.css
├── login-register.module.css
└── page.module.css
```

Components use CSS Modules for scoped styling alongside Tailwind utility classes.
`globals.css` defines the shared typography classes (`text-medium-14`,
`text-regular-12`, …) used across the app.

## 🔑 Key Architectural Patterns

### 1. Separation of Concerns
- **Components**: UI rendering only
- **Hooks**: Business logic and side effects
- **Store**: Global state and request deduplication
- **Services**: Database logic, imported by routes
- **Utils**: Pure helper functions

### 2. Component Hierarchy
```
Layouts (page structure)
  └── Templates (page sections)
      └── Modules (feature components)
          └── UI (primitives)
```

### 3. State Management Strategy
- **Zustand stores**: Shared state, request deduplication, optimistic updates
- **Local state**: Form fields and other component-only concerns
- Optimistic updates always keep the previous value and roll back on failure

### 4. API Conventions

Every protected route follows the same shape:

```javascript
const { userId, response } = requireUser(request);
if (response) return response;
```

Admin-only routes then check `OrganizationService.isOrgAdmin()` and return 403
rather than failing silently.

Responses are consistently `{ success, ... }` or `{ success: false, message }`.

### 5. Icons

All SVGs live in `src/components/ui/icons.js`. Icons that need sizing or hover
classes accept a `className` prop.

> ⚠️ SVGs with hard-coded gradient or filter `id` values must not render twice on
> the same page — duplicate IDs break the second instance.

## 📦 Module Exports

Key directories use `index.js` for clean imports:

```javascript
// ❌ Without barrel exports
import useAuthStore from '@/store/auth/authStore';
import useFilesStore from '@/store/features/files/filesStore';

// ✅ With barrel exports (store/index.js)
import { useAuthStore, useFilesStore } from '@/store';
```

## 🔒 Security Considerations

### Protected Files (in `.gitignore`)
- `.env.local` - Environment variables
- `node_modules/` - Dependencies
- `.next/` - Build output

### Authentication Flow
```
Password ──► 2FA required? ──► challenge cookie ──► code ──► session
         └── no ─────────────────────────────────────────► session

Access token  15 minutes, rotated proactively at 12
Refresh token 30 days, sliding, rotated on every use
Challenge      5 minutes, no API authority
```

### Where the guards live

| Concern | Enforced in |
|---|---|
| Route access | `middleware.js` |
| API caller identity | `requireUser` / `requireUserOrEnrolment` |
| Admin-only actions | `OrganizationService.isOrgAdmin` |
| Share link policy | `utils/files/linkPolicy.js` |
| Two-factor policy | `login` and `oauth-session` routes |

Middleware sets identity headers on the **request**, not the response, and strips
any inbound values first so a client cannot spoof them.

## 📚 Additional Documentation

- [README.md](README.md) - Project overview and setup
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development notes and resolved issues

## 🚀 Quick Navigation

**Authentication?** → `/src/app/api/auth/`, `/src/hooks/auth/`, `/src/utils/auth/`

**Admin console?** → `/src/app/api/admin/`, `/src/utils/admin/`, `/src/components/templates/home/admin-console/`

**UI components?** → `/src/components/modules/`, `/src/components/ui/`

**New pages?** → `/src/app/`, `/src/components/layouts/`

**State?** → `/src/store/`

**Utilities?** → `/src/utils/`, `/src/lib/`

---

**Last Updated**: August 2026
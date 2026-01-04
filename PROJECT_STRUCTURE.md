# 📁 Project Structure

Complete directory structure and organization of nexFile project.

## 📋 Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Core Directories](#core-directories)
- [Component Organization](#component-organization)
- [State Management](#state-management)
- [API Routes](#api-routes)
- [Testing](#testing)

## 🎯 Overview

nexFile follows Next.js 15 App Router architecture with a clean separation of concerns:
- **App Router** (`src/app/`) - Pages and API routes
- **Components** (`src/components/`) - Reusable UI components
- **Hooks** (`src/hooks/`) - Custom React hooks
- **Store** (`src/store/`) - Zustand state management
- **Utils** (`src/utils/`) - Helper functions and utilities
- **Models** (`src/models/`) - Mongoose database schemas

## 📂 Directory Structure
```
nexFile/
├── public/                      # Static assets
│   ├── uploads/                # User uploaded files (gitignored)
│   └── favicon.ico             # App icon
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Core utilities
│   ├── models/                 # Database models
│   ├── store/                  # State management
│   ├── styles/                 # CSS modules
│   ├── utils/                  # Helper functions
│   └── __tests__/              # Integration tests
├── .env.local                  # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
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

Next.js 15 App Router structure with pages and API endpoints.

#### Pages
```
app/
├── page.js                     # Landing page
├── home/                       # Main application
├── login-register/             # Authentication pages
├── folder/                     # Folder view page
├── paper-doc/[fileId]/         # Document editor
├── pdf-editor/                 # PDF editing interface
└── transfer/                   # File transfer page
```

#### API Routes
```
app/api/
├── auth/                       # Authentication endpoints
│   ├── register/               # User registration
│   ├── login/                  # User login
│   ├── logout/                 # User logout
│   ├── me/                     # Get current user
│   ├── refresh/                # Refresh access token
│   ├── forgot-password/        # Request password reset
│   ├── reset-password/         # Reset password with token
│   └── [...nextauth]/          # NextAuth.js (Google OAuth)
├── files/                      # File management
│   ├── route.js                # List/delete files
│   └── upload/                 # File upload endpoint
├── folders/                    # Folder management
│   └── route.js                # CRUD operations
├── users/                      # User operations
│   └── search/                 # Search users for sharing
└── test-db/                    # Database connection test
```

### `/src/components/` - UI Components

Organized by feature and responsibility.

#### Component Organization
```
components/
├── layouts/                    # Page layouts
│   ├── Admin/                  # Admin console layout
│   ├── Auth/                   # Authentication layout
│   ├── Folder/                 # Folder view layout
│   ├── Home/                   # Main app layout
│   ├── Modal/                  # Modal management
│   └── pdf-editor/             # PDF editor layout
│
├── modules/                    # Feature modules
│   ├── admin-console/          # Admin features
│   ├── home/                   # Home page modules
│   ├── login-register/         # Auth UI components
│   ├── Modals/                 # Modal components
│   └── paper-doc/              # Document editor modules
│
├── templates/                  # Page templates
│   ├── home/                   # Home page sections
│   ├── login-register/         # Auth forms
│   ├── pdf-editor/             # PDF editor UI
│   └── transfer/               # Transfer page sections
│
└── ui/                         # Shared UI components
    ├── FileIcon.js             # File type icons
    ├── icons.js                # SVG icons
    ├── PasswordRequirements.jsx
    ├── PasswordStrengthIndicator.jsx
    ├── Switch.js               # Toggle switch
    └── signatureFonts.js       # Signature fonts
```

#### Key Component Categories

**Layouts**: Wrapper components that define page structure
- `FileManagementLayout` - Main application layout with sidebar
- `AdminLayout` - Admin console with navigation
- `AuthLayout` - Authentication pages layout

**Modules**: Feature-specific components
- `admin-console/` - Admin dashboard components
- `Modals/` - All modal dialogs
- `home/` - Home page specific modules

**Templates**: Complete page sections
- Pre-built sections for different pages
- Composed of multiple modules

**UI**: Reusable utility components
- Icons, switches, indicators
- Generic components used across app

### `/src/hooks/` - Custom React Hooks

Business logic and state management hooks.
```
hooks/
├── auth/                       # Authentication hooks
│   ├── useAuth.js              # Main auth hook with auto-refresh
│   ├── useLogin.js             # Login form logic
│   ├── useRegister.js          # Registration logic
│   ├── useLogout.js            # Logout functionality
│   ├── useForgetPassword.js    # Forgot password flow
│   └── useResetPassword.js     # Reset password logic
│
├── files/                      # File management hooks
│   ├── fileUpload/             # Upload functionality
│   │   ├── useUploadFile.js    # File upload logic
│   │   └── useUploadModal.js   # Upload modal state
│   ├── filesManagement/
│   │   └── useFiles.js         # File CRUD operations
│   ├── FileRequestModal/       # File request hooks
│   └── fileRequests/           # File requests management
│
├── folders/                    # Folder management
│   ├── useCreateFolder.js      # Create folder logic
│   └── useFolders.js           # Folder CRUD operations
│
├── shareModal/                 # Sharing functionality
│   ├── useShareModal.js        # Share modal state
│   ├── useInvitedUsers.js      # Manage invited users
│   ├── useUserSearch.js        # Search users
│   └── useShareActions.js      # Share actions
│
├── createTransferModal/
│   └── useTransferFiles.js     # File transfer logic
│
├── canvas/
│   └── useDarkModeCanvas.js    # Canvas dark mode
│
└── useSorting.js               # Generic sorting hook
```

### `/src/store/` - Zustand State Management

Global application state.
```
store/
├── auth/
│   └── authStore.js            # Authentication state
│
├── features/
│   ├── files/
│   │   └── filesStore.js       # Files state
│   ├── folders/
│   │   └── foldersStore.js     # Folders state
│   ├── pdf-editor/
│   │   └── pdfEditorStore.js   # PDF editor state
│   ├── signatures/             # Signatures state (TBD)
│   └── transfer/
│       └── transferStore.js    # Transfer state
│
├── ui/
│   ├── modalStore.js           # Modal visibility state
│   └── dropdownStore.js        # Dropdown state
│
└── index.js                    # Store exports
```

### `/src/lib/` - Core Utilities

Essential library functions.
```
lib/
├── mongodb.js                  # MongoDB connection
├── fetchWithAuth.js            # Authenticated fetch wrapper
├── emailService.js             # Email sending (Nodemailer)
├── toast.js                    # Toast notifications
└── sweetAlert.js               # SweetAlert dialogs
```

### `/src/models/` - Database Models

Mongoose schemas for MongoDB.
```
models/
├── User.js                     # User schema
├── File.js                     # File metadata schema
├── Folder.js                   # Folder schema
├── RefreshToken.js             # Refresh token schema
└── PasswordReset.js            # Password reset token schema
```

### `/src/utils/` - Helper Functions

Utility functions organized by feature.
```
utils/
├── auth/                       # Authentication utilities
│   ├── tokenManager.js         # JWT token management
│   ├── hashPassword.js         # Password hashing
│   ├── validators.js           # Auth validation schemas
│   └── __tests__/              # Auth utils tests
│
├── files/                      # File utilities
│   ├── fileService.js          # File operations
│   └── fileValidators.js       # File validation
│
├── folders/                    # Folder utilities
│   ├── folderService.js        # Folder operations
│   ├── folderHelpers.js        # Folder helpers
│   └── folderValidator.js      # Folder validation
│
├── constants/                  # App constants
│   ├── adminConstants.js
│   ├── billingConstants.js
│   ├── fileActionMenuConstants.js
│   ├── navbarConstants.js
│   └── ... (other constants)
│
├── clipboard.js                # Clipboard operations
├── formScroll.js               # Form scroll utilities
├── passwordUtils.js            # Password strength
├── fileRequestUtils.js         # File request helpers
└── validators.js               # Generic validators
```

### `/src/__tests__/` - Testing

Integration and unit tests.
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

## 🎨 Styling Organization
```
src/styles/
├── home/
│   └── home.module.css         # Home page styles
├── pdf-editor/
│   └── pdf-editor.module.css   # PDF editor styles
├── login-register.module.css   # Auth page styles
└── page.module.css             # Landing page styles
```

**Note**: Most components use CSS Modules (`.module.css`) for scoped styling alongside Tailwind CSS utility classes.

## 🔑 Key Architectural Patterns

### 1. **Separation of Concerns**
- **Components**: UI rendering only
- **Hooks**: Business logic and side effects
- **Store**: Global state management
- **Utils**: Pure helper functions
- **API Routes**: Backend logic

### 2. **Feature-First Organization**
Related files grouped by feature (e.g., all auth-related code together).

### 3. **Component Hierarchy**
```
Layouts (page structure)
  ├── Templates (page sections)
  │   ├── Modules (feature components)
  │   │   └── UI (basic components)
```

### 4. **State Management Strategy**
- **Zustand stores**: Global application state
- **React hooks**: Component-level logic
- **Context** (minimal usage): Avoid prop drilling when needed

### 5. **API Structure**
- RESTful endpoints in `/api`
- Authentication middleware
- Separated concerns (auth, files, folders)

## 📦 Module Exports

### Barrel Exports
Key directories use `index.js` for clean imports:
```javascript
// ❌ Without barrel exports
import { authStore } from '@/store/auth/authStore';
import { filesStore } from '@/store/features/files/filesStore';

// ✅ With barrel exports (store/index.js)
import { authStore, filesStore } from '@/store';
```

## 🔒 Security Considerations

### Protected Files (in `.gitignore`)
- `.env.local` - Environment variables
- `public/uploads/` - User uploaded files
- `node_modules/` - Dependencies
- `.next/` - Build output

### Authentication Flow
```
User → Login → JWT Access Token (15m) + Refresh Token (30d)
      ↓
   Access APIs with token
      ↓
   Token expires → Auto-refresh → New tokens
      ↓
   Continue session seamlessly
```

## 📚 Additional Documentation

- [README.md](README.md) - Project overview and setup
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development notes and progress
- API documentation (coming soon)
- Component storybook (planned)

## 🚀 Quick Navigation

**Working on authentication?** → `/src/app/api/auth/`, `/src/hooks/auth/`, `/src/store/auth/`

**Building UI components?** → `/src/components/modules/`, `/src/components/ui/`

**Adding new pages?** → `/src/app/`, `/src/components/layouts/`

**Creating API endpoints?** → `/src/app/api/`

**Managing state?** → `/src/store/`

**Need utilities?** → `/src/utils/`, `/src/lib/`

---

**Last Updated**: January 2026
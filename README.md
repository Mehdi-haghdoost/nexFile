# nexFile

A modern, secure file management system built with Next.js 15 and MongoDB.

## 🚀 Features

### Core Features
- 📁 **File & Folder Management**: Organize files with intuitive folder structure
- 📤 **File Upload**: Drag & drop support with progress tracking
- 🔍 **Advanced Search**: Find files and folders quickly
- 👁️ **File Preview**: View files without downloading
- 🤝 **File Sharing**: Collaborate with team members
- 📨 **File Requests**: Collect files from people without an account
- ✍️ **Digital Signatures**: Sign documents electronically
- 📊 **Admin Console**: Members, groups, content, security, billing and settings

### UI/UX Features
- 📱 **Fully Responsive**: Works seamlessly on all devices
- 🌙 **Dark Mode**: Eye-friendly interface with theme toggle
- 🎨 **Modern Design**: Clean, professional interface with Tailwind CSS
- ⚡ **Fast Performance**: Optimized with Next.js 15 and React 19

### Security Features
- 🔐 **JWT Authentication**: Secure access and refresh token system
- 🔑 **Two-Step Verification**: TOTP authenticator apps with backup codes
- 🏢 **Organization Policy**: Optionally require 2FA for every member
- 🔄 **Token Rotation**: Race-safe rotation with reuse detection
- 🔒 **httpOnly Cookies**: Protected against XSS attacks
- 📧 **Security Notices**: Email alerts on password and 2FA changes
- 🌐 **Google OAuth**: Quick login with Google account
- 🛡️ **Protected Routes**: Middleware-based route protection
- 🔗 **Link Policies**: Organization-wide password and expiry rules on share links

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 (with Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Zustand
- **Form Validation**: Zod
- **Icons**: Custom SVG components

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + Auth.js v5 for Google
- **Two-Factor**: otpauth (RFC 6238) + qrcode
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer (SMTP)
- **File Storage**: Cloudinary

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Testing**: Vitest + Testing Library

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Gmail Account**: For SMTP email service (or other SMTP provider)
- **Cloudinary Account**: For file storage

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Mehdi-haghdoost/nexFile.git
cd nexFile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup

Create `.env.local` in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nexfile
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexfile

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Auth.js v5 reads AUTH_* names; use the same value as NEXTAUTH_SECRET
AUTH_SECRET=your-super-secret-key-min-32-chars
AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: shorten token lifetimes while testing (seconds)
# ACCESS_TOKEN_TTL=30
# REFRESH_TOKEN_TTL=600
```

Generate a secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> ⚠️ `AUTH_SECRET` signs every token in the application. Anyone who knows it can
> forge a valid session for any account. Never commit it or paste it anywhere.

### 4. Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password:
   - App: **Mail**
   - Device: **NexFile**
5. Copy the 16-character password (**no spaces**) to `SMTP_PASS`

> Google automatically revokes app passwords it detects as exposed. If email
> stops working with `EAUTH 535-5.7.8`, generate a new one.

### 5. Google OAuth Setup (Optional)

In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services →
Credentials, add this to **Authorized redirect URIs**:

```
http://localhost:3000/api/auth/callback/google
```

Without it, Google rejects the sign-in with `redirect_uri_mismatch`.

### 6. Run Development Server
```bash
npm run dev
```

### 7. Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts
```bash
npm run dev            # Start development server with Turbopack
npm run build          # Build optimized production bundle
npm start              # Start production server
npm run lint           # Run ESLint for code quality
npm test               # Run tests with Vitest
npm run test:ui        # Vitest UI
npm run test:coverage  # Coverage report
```

## 🔐 Authentication System

### Sign-in paths

```
Email + password ─┬─ no 2FA ──────────────► session issued
                  │
                  ├─ 2FA on ──────────────► code step ──► session
                  │
                  └─ org requires 2FA ────► enrolment ──► session
                     and account has none

Google ───────────► provider callback ──► /api/auth/oauth-session
                                          (same three branches)
```

### Token lifetimes

| Token | Lifetime | Purpose |
|---|---|---|
| Access | 15 minutes | Sent with every request |
| Refresh | 30 days, sliding | Obtains a new access token |
| Challenge | 5 minutes | Between password and code; grants no API access |

The refresh window restarts on each rotation, so an active user is never signed
out. `useAuth` rotates proactively at 12 minutes, ahead of expiry.

### Two-step verification

- TOTP via any authenticator app (Google Authenticator, Authy, 1Password)
- 10 single-use backup codes, shown once
- Email recovery when both are lost
- Five failed attempts lock the account for 15 minutes
- Admins can require it for every member of the organization

### Security Measures
- 🔒 Password hashing with bcrypt
- 🔒 TOTP secrets encrypted at rest with AES-256-GCM
- 🔒 Backup codes HMAC hashed, single use
- 🔒 TOTP replay rejected via a recorded counter
- 🔒 httpOnly cookies prevent XSS attacks
- 🔒 Refresh token rotation with reuse detection
- 🔒 Database-backed refresh tokens with revocation
- 🔒 CSRF protection with SameSite cookies
- 🔒 Secure flag in production (HTTPS only)
- 🔒 Redirect targets validated as same-origin paths

## 🏢 Admin Console

| Section | What it does |
|---|---|
| **Dashboard** | Licence and storage usage at a glance |
| **Members** | Invite, suspend and change roles |
| **Groups** | Group membership management |
| **Content** | Shared files and folders across the organization |
| **Security** | Link policies, 2FA, activity log |
| **Billing** | Plan, seat and storage usage, cost summary |
| **Settings** | Team name, language, feature flags, policies |

Organization-wide settings are admin-only; other members see the values but
cannot change them.

## 📂 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for the full tree.

```
nexFile/
├── src/
│   ├── app/           # App Router pages and API routes
│   ├── components/    # layouts → templates → modules → ui
│   ├── hooks/         # Business logic
│   ├── lib/           # Core infrastructure (db, auth, email, fetch)
│   ├── models/        # Mongoose schemas
│   ├── store/         # Zustand stores
│   └── utils/         # Helpers, services and constants
├── public/
└── middleware.js
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (**generate fresh secrets**, do not reuse dev ones)
4. Update the Google OAuth redirect URI to the production domain
5. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact & Support

- **Developer**: Mehdi Haghdoost
- **Telegram**: [@Mehdi-Madridista](https://t.me/Mehdi-Madridista)
- **LinkedIn**: [Mehdi Haghdoost](https://www.linkedin.com/in/mehdi-haghdoost-463610100)
- **GitHub**: [nexFile Repository](https://github.com/Mehdi-haghdoost/nexFile)

## 📄 License

This project is private and not licensed for public use.

---

**Built with ❤️ using Next.js 15 and React 19**
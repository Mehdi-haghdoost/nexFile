# nexFile

A modern, secure file management system built with Next.js 15 and MongoDB.

## 🚀 Features

### Core Features
- 📁 **File & Folder Management**: Organize files with intuitive folder structure
- 📤 **File Upload**: Drag & drop support with progress tracking
- 🔍 **Advanced Search**: Find files and folders quickly
- 👁️ **File Preview**: View files without downloading
- 🤝 **File Sharing**: Collaborate with team members
- ✍️ **Digital Signatures**: Sign documents electronically
- 📊 **Admin Dashboard**: Manage users, content, and permissions

### UI/UX Features
- 📱 **Fully Responsive**: Works seamlessly on all devices
- 🌙 **Dark Mode**: Eye-friendly interface with theme toggle
- 🎨 **Modern Design**: Clean, professional interface with Tailwind CSS
- ⚡ **Fast Performance**: Optimized with Next.js 15 and React 19

### Security Features
- 🔐 **JWT Authentication**: Secure access and refresh token system
- 🔄 **Token Rotation**: Enhanced security with automatic token refresh
- 🔒 **httpOnly Cookies**: Protected against XSS attacks
- 📧 **Email Verification**: Password reset via secure email links
- 🌐 **Google OAuth**: Quick login with Google account
- 🛡️ **Protected Routes**: Middleware-based route protection

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 (with Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Validation**: Zod
- **Icons**: Custom SVG components

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer (SMTP)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Environment**: dotenv

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Gmail Account**: For SMTP email service (or other SMTP provider)

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

Create `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/nexfile
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexfile

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=nexFile <your-email@gmail.com>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password:
   - App: **Mail**
   - Device: **NexFile**
5. Copy the 16-character password to `SMTP_PASS` in `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

### 6. Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build optimized production bundle
npm start        # Start production server
npm run lint     # Run ESLint for code quality
```

## 🔐 Authentication System

### Features
- ✅ **User Registration**: Email/password with validation
- ✅ **Secure Login**: JWT-based authentication
- ✅ **Google OAuth**: One-click social login
- ✅ **Token Management**: 
  - Access Token: 15 minutes (short-lived)
  - Refresh Token: 30 days (long-lived, database-backed)
- ✅ **Automatic Refresh**: Seamless token renewal before expiry
- ✅ **Token Rotation**: Old refresh tokens revoked after use
- ✅ **Password Reset**: Secure email-based password recovery
- ✅ **Protected Routes**: Middleware authentication checks
- ✅ **Session Persistence**: Secure httpOnly cookies

### Security Measures
- 🔒 Password hashing with bcrypt (10 rounds)
- 🔒 httpOnly cookies prevent XSS attacks
- 🔒 Refresh token rotation prevents replay attacks
- 🔒 Database-backed refresh tokens with revocation
- 🔒 CSRF protection with SameSite cookies
- 🔒 Secure flag in production (HTTPS only)

## 📂 Project Structure
```
nexFile/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/         # Authentication endpoints
│   │   ├── home/             # Main application
│   │   └── login-register/   # Auth pages
│   ├── components/            # React components
│   │   ├── layouts/          # Layout components
│   │   └── modules/          # Feature modules
│   ├── hooks/                 # Custom React hooks
│   │   ├── auth/             # Authentication hooks
│   │   └── files/            # File management hooks
│   ├── lib/                   # Utilities
│   │   ├── fetchWithAuth.js  # Authenticated fetch wrapper
│   │   ├── mongodb.js        # Database connection
│   │   └── toast.js          # Notification system
│   ├── models/                # Mongoose models
│   ├── store/                 # Zustand stores
│   └── utils/                 # Helper functions
├── public/                    # Static assets
└── middleware.js              # Next.js middleware
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

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
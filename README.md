# nexFile

A modern file management system built with Next.js and MongoDB.

## 🚀 Features

- 📁 File and folder management
- 📤 File upload with drag & drop
- 🔍 Advanced search functionality
- 👁️ File preview
- 🤝 File sharing and collaboration
- ✍️ Digital signatures
- 📊 Content management
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🔐 Secure authentication with JWT
- 📧 Email-based password reset
- 🔄 Google OAuth integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer (SMTP)
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 14 or higher
- MongoDB (local or MongoDB Atlas)
- Gmail account (for SMTP email sending)

## ⚙️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Mehdi-haghdoost/nexFile.git
cd nexFile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.

4. **Set up Gmail App Password:**

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Create password for "Mail" → "NexFile"
   - Copy the 16-digit password to `SMTP_PASS` in `.env.local`

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔐 Authentication Features

- ✅ User registration with validation
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ JWT-based authentication
- ✅ Refresh token rotation
- ✅ Password reset via email
- ✅ Protected routes with middleware
- ✅ Session management

## 📧 Contact

- **Telegram**: [@Mehdi-Madridista](https://t.me/Mehdi-Madridista)
- **LinkedIn**: [Mehdi Haghdoost](https://www.linkedin.com/in/mehdi-haghdoost-463610100)
- **GitHub**: [Project Link](https://github.com/Mehdi-haghdoost/nexFile)
# 🔧 Development Notes

Personal development notes for nexFile project

---

# ✅ Completed: Authentication System (Week 1)

## Day 1-2: Setup & Register ✅

* MongoDB connection
* User model with validation
* Register API with Zod validation
* Password hashing with bcrypt
* Register form integration

## Day 3-4: Login & Session ✅

* Login API with JWT
* Access token (15m) + Refresh token (30d)
* Token manager utilities
* Protected route middleware
* Session management with httpOnly cookies
* Zustand auth store

## Day 5-6: Advanced Auth ✅

* Refresh token system with rotation
* Automatic token refresh mechanism
* Token revocation on logout
* Google OAuth integration
* Protected routes with automatic redirect

## Day 7: Password Reset ✅

* Forget Password API
* Reset Password API
* Email service with Nodemailer
* Professional HTML email templates
* Complete password reset flow

## Day 8: Token Refresh & Session Management ✅

* **fetchWithAuth wrapper**: Automatic token refresh on 401 errors
* **Refresh token rotation**: Old tokens revoked after use for security
* **Database-backed refresh tokens**: Persistent token storage with MongoDB
* **Periodic auth checks**: Automatic session validation
* **Race condition prevention**: Shared lock for simultaneous refresh requests
* **Cookie security**: httpOnly, sameSite, and secure flags
* **Client-side architecture**: Single useAuth instance to prevent conflicts
* **Error handling**: Proper user feedback and automatic login redirect

---

# ✅ Completed: Session Hardening

The session used to end far earlier than the configured 30 days. Four separate
causes, each fixed:

## 1. Middleware ignored the refresh token

Middleware only inspected the 15 minute access token, so any navigation after it
lapsed redirected to login even though a valid 30 day refresh token was sitting
in the cookie jar. It now checks both and lets the request through so the client
can rotate.

## 2. Concurrent refreshes ended the session

Several requests hitting a 401 at the same moment each presented the same
refresh token. The first burned it and the rest were rejected as invalid.

Fixed with three pieces:

* `claimRefreshToken` uses a single atomic `findOneAndUpdate`, so only one caller
  can transition a token from active to revoked
* A **grace window** (60s) serves latecomers the replacement token rather than
  rejecting them
* Genuine reuse **outside** that window is treated as theft and revokes every
  session for the account

## 3. Lifetimes were declared twice

`expiresIn` and cookie `maxAge` were separate literals that could drift apart.
Both now derive from one set of constants in seconds, plus a 60 second skew
buffer on the access cookie so clock drift cannot delete it early.

## 4. Password change logged the user out

`revokeAllUserTokens` also revoked the caller's own token. With no successor
recorded, the next rotation read it as stolen and killed the account session.
Now other sessions are **deleted** and the calling token is excluded.

### Other fixes in this pass

* Identity headers moved from the **response** to the **request**, where route
  handlers can actually read them and where they are no longer exposed to the
  browser. Inbound values are stripped first to prevent spoofing.
* `clearAuthCookies` overwrites with matching path options instead of relying on
  `delete`, which did not always remove the cookie.
* Root path matching in middleware is exact, so `/` no longer marks every route
  public.
* Login redirect uses a full navigation. `router.refresh()` right after
  `router.push()` invalidated the RSC cache mid-navigation and intermittently
  cancelled it.
* The login form no longer applies full password strength rules, which were
  disabling the submit button for accounts created before those rules existed.

---

# ✅ Completed: Google Sign-in

Google sign-in never actually worked. Two bugs stacked:

1. `signIn("google", { redirect: false })` — for OAuth providers NextAuth returns
   a URL instead of navigating, so the user never reached Google at all.
2. Even on success, nothing issued the app's own cookies. The middleware requires
   `token`, so a "signed in" user was bounced straight back to login.

### How it works now

```
Google button → full redirect to Google
              → callback → /login-register?oauth=google
              → POST /api/auth/oauth-session
              → app cookies issued, provider session dropped
              → /home
```

The provider session is signed out immediately after the exchange, so a
signed-out user cannot silently re-authenticate.

NextAuth config moved to `src/lib/auth.js` so `auth()` can be imported by server
code without pulling in the route handler.

---

# ✅ Completed: Two-Step Verification (TOTP)

## Enrolment

* `otpauth` (RFC 6238) rather than a hand-rolled implementation
* Secrets encrypted at rest with **AES-256-GCM**, so a database dump alone cannot
  produce valid codes
* A pending secret expires after 15 minutes and is only promoted once a code is
  confirmed, so an abandoned attempt cannot be resumed
* 10 single-use backup codes, **HMAC hashed** — high entropy means bcrypt's cost
  would only slow the login path without adding security

## Login challenge

A correct password yields only a short-lived challenge cookie. Session cookies
are issued after a TOTP or backup code is accepted, so a stolen password cannot
reach the account alone.

* Backup codes are burned on use
* TOTP codes are rejected on replay via a recorded counter, so a code read over
  someone's shoulder cannot be reused inside its 30 second window
* Five failed attempts lock the account for 15 minutes

## Recovery

Lost both the authenticator and the backup codes? A recovery link is emailed.

* Requires a valid challenge cookie, so only someone who already proved the
  password can trigger it
* Token stored as a SHA-256 hash with a 15 minute TTL, single use
* Confirming disables two-step and ends every session, since a recovery implies
  the account may be contested
* A failed send deletes the token rather than reporting success — a live link
  that nobody knows about is worse than making the user retry

## Organization enforcement

`Organization.settings.policies.enforceTwoFactor` requires every member to enrol.

Challenge tokens carry a **purpose** (`login` or `enrolment`). An enrolment token
unlocks only the setup endpoints, so a member who must enrol can do so without
holding a session that would bypass the policy. A token issued for one purpose is
rejected by the other.

Google sign-in follows the same path — social login is not a bypass.

## Security notices

Enabling, disabling or recovering two-step verification and changing a password
all email the account owner. Whoever holds the password can already reach the
account, so the value is telling the real owner it happened.

Notices are fired **without awaiting** — a mail outage must never stop someone
protecting their account.

---

# ✅ Completed: Admin Console

## Security

* Organization-wide link policies (password, expiration, external sharing)
* Enforced server-side in `linkPolicy.js`, not just in the UI
* Warns how many existing links would violate a newly enabled policy
* Activity log with category filters and export

## Billing

Every figure was a fixed string that contradicted the rest of the app — billing
claimed "540 MB of 100 GB" while the sidebar showed "25 GB of 50 GB".

Now:

* Plan catalogue with seat limits and storage quotas
* Seat count from active memberships
* Storage from the file sizes those members own
* Cost summary computed from the plan
* Trial state with real dates

**Money is held in integer cents** and the tax rate in basis points, because
`59.00 * 0.1` does not equal `5.9` in JavaScript.

The trial is keyed on `trialStartedAt`, not `trialEndsAt` — otherwise clearing or
expiring the end date silently granted a fresh trial on the next request.

The sidebar storage widget now reads from the same source, so the two can no
longer disagree.

## Settings

* Team overview: name and language, persisted per organization
* Product feature flags and organization policies, stored separately so each is
  validated against its own key list
* Only known keys are written, so an unexpected field cannot be injected
* Non-admin members see disabled controls rather than a failure on save
* Every change recorded in the activity log

---

# ✅ Completed: Performance

## Folder request deduplication

Every component mounting `useFolders` fired its own request — four to five
identical calls per page load. Fetching moved into the store behind an in-flight
map and a short cache window, so parallel mounts share a single call.

The store also goes through `fetchWithAuth` now, which retries once after a 401
instead of failing silently on an expired token.

---

# 📝 Paper Doc Development Plan (Simple Version)

## Current Situation

Paper Doc currently works as a basic document editor UI with:

* Sidebar for folders
* Text editing area
* Toolbar UI
* `.paper` files already stored in MongoDB

But the editor still lacks:

* Real database persistence
* Content loading
* Autosave functionality
* API integration

---

## ✅ Phase 1 Goal (Simple Implementation)

Implement a minimal working document system before adding Rich Text features.

### Planned Features

* Load `.paper` file content from MongoDB
* Save content changes to database
* Auto-save every few seconds
* Keep editor as plain text for now
* Delay TipTap / Rich Text implementation until later phase

---

## Planned APIs

### GET `/api/files/paper/:fileId`

Load document content from database.

### PUT `/api/files/paper/:fileId`

Update and save document content.

---

## Frontend Tasks

### page.js

* Read `fileId` from route params
* Fetch document content on mount
* Handle loading and error states

### DocumentEditor

* Connect textarea/editor to API
* Add autosave mechanism
* Track unsaved changes

### Toolbar

* Keep as UI only for now
* Functional editor tools postponed to Rich Text phase

---

## Why This Approach?

Rich Text editors are large features and can significantly slow down development.

The current priority is:

1. Stable document persistence
2. Reliable autosave
3. Basic editor workflow
4. MongoDB integration

After the simple version is stable, migrate incrementally to:

* TipTap
* Rich formatting
* Tables
* Images
* Slash commands
* Notion-style blocks

---

# 🎓 What I Learned

## Authentication & Security

* JWT authentication (Access + Refresh tokens)
* Refresh token rotation, and why it needs a grace window
* Distinguishing genuine token reuse from a concurrency race
* TOTP: encryption at rest, replay protection, lockout
* Why a challenge token needs a declared purpose
* httpOnly cookies vs localStorage security
* Race condition prevention in async operations
* Notifying the account owner matters when prevention is impossible

## Backend Development

* MongoDB with Mongoose ORM
* Mongoose projections: mixing plain field names with `+` prefixed ones makes the
  projection **inclusive** and silently drops everything else
* Atomic operations (`findOneAndUpdate`) to resolve races at the database level
* Next.js 15 API routes and middleware
* Email integration with Nodemailer (Gmail SMTP)
* SMTP timeouts — without them a blocked port hangs a request for minutes
* Server-side validation with Zod
* Integer cents for money, never floats

## Frontend Development

* Zustand state management patterns
* Module-level in-flight maps for request deduplication
* Optimistic updates with rollback on failure
* React 19 hooks and useEffect dependencies
* Next.js 15 client/server component architecture
* Guarding against StrictMode double-invocation for single-use operations
* Zustand stores are module singletons — never read them during server render

## Code Quality

* Git commit message conventions
* Incremental development and testing
* Delete superseded code rather than commenting it out; git history keeps it
* Debug logging and cleanup
* Code organization and separation of concerns

---

# 🎯 Next Steps

* [ ] Trash retention policy (auto-purge deleted files after N days)
* [ ] Upload limits (max file size, blocked extensions)
* [ ] Storage threshold email alerts
* [ ] Wire the `sendAndMonitor` and `password` feature flags into their features
* [ ] Organization logo upload (Cloudinary)
* [ ] Billing actions: plan change, payment method, invoices
* [ ] Paper Doc save/load APIs
* [ ] Paper Doc autosave system
* [ ] Remove remaining `console.log` calls (~100 across 40 files)
* [ ] Unit and integration tests for the two-factor flows

---

# 🐛 Issues Resolved

1. **Multiple useAuth instances**
   Fixed by using useAuthStore directly in child components

2. **Infinite loop in UploadFileModal**
   Resolved by removing clearFiles from useEffect dependencies

3. **Token refresh conflicts**
   Atomic claim plus a grace window; genuine reuse revokes all sessions

4. **Cookie update issues**
   Fixed sameSite and secure settings based on environment

5. **Client component errors**
   Added `"use client"` directives to hooks

6. **Sessions ending far earlier than 30 days**
   Middleware ignored the refresh token entirely — see Session Hardening above

7. **Password change signing the user out**
   Revoking every token also revoked the caller's own

8. **Google sign-in never reaching Google**
   `redirect: false` returns a URL for OAuth providers instead of navigating

9. **Gmail App Password revoked**
   `EAUTH 535-5.7.8`. Google invalidates app passwords it detects as exposed.
   Never paste credentials anywhere they can leak.

10. **`EENVELOPE No recipients defined`**
    A Mongoose projection listing plain field names is inclusive, so `email` was
    being dropped from the query result

11. **Next.js 15 hydration mismatch on SVG attributes**
    Reproduces with a bare `<svg>` in an empty client component, under both
    Turbopack and webpack, with a single deduped React version. The reported diff
    shows **identical values** on both sides, so this is a framework-level
    reporter bug rather than application code. Dev-overlay only — it does not
    render in a production build. Not worked around; `suppressHydrationWarning`
    would also mask genuine mismatches later.

---

# 📝 Notes for Future

* Always test token refresh mechanism with short expiry times first
* Remember to clear cookies when testing authentication flows
* Use debug logs during development, remove before production
* Refresh tokens should always be stored in database, not just cookies
* Consider implementing refresh token cleanup cron job for production
* Rotate every secret before any real deployment — `AUTH_SECRET` signs every
  token in the app
* Keep Paper Doc architecture simple first, then evolve into Rich Text editor
  incrementally
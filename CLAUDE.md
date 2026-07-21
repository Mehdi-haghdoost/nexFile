# NexFile Project Instructions

## Project Overview
NexFile is a full-stack document and file management application.

## Tech Stack

Frontend:
- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- CSS Modules

Backend:
- Next.js API Routes
- MongoDB
- Mongoose

State Management:
- Zustand

Testing:
- Vitest
- Testing Library

## Architecture Rules

- Use existing project architecture.
- Do not introduce new frameworks without approval.
- Keep App Router conventions.
- Prefer existing hooks and stores.

## Authentication

Authentication is handled through:
- API routes
- middleware.js
- token management
- auth store

Do not replace authentication architecture.

## Database

Models are located in:
src/models

Use existing Mongoose patterns.

## File Management

Main areas:
- files API routes
- folder management
- permissions
- uploads

Avoid changing file architecture without analysis.

## Coding Rules

Before modifying files:
1. Explain the problem.
2. Explain the proposed solution.
3. List files that will change.

Make minimal changes.

Do not modify unrelated files.
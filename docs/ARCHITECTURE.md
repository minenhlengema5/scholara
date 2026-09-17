# Architecture

## High-level flow

```
        ┌──────────┐
        │   User   │
        └────┬─────┘
             │  interacts with the dashboard
             ▼
   ┌───────────────────┐
   │  React Frontend   │   (Next.js / React + Tailwind CSS)
   │  - Sidebar nav    │
   │  - Feature forms  │
   └────────┬──────────┘
            │  HTTP POST (JSON)
            ▼
   ┌───────────────────┐
   │  Node.js Backend  │   (Express.js API — routes + controllers)
   │  /generate-email  │
   │  /summarize-meeting
   │  /plan-tasks      │
   │  /chat            │
   └────────┬──────────┘
            │  prompt + system instruction
            ▼
   ┌───────────────────┐
   │   Gemini API      │   (Google Generative AI — gemini-2.5-flash)
   └────────┬──────────┘
            │  AI response
            ▼
   ┌───────────────────┐
   │   AI Response     │  → rendered back in the frontend for review
   └───────────────────┘
```

## Two runtimes, one design

This project demonstrates the requested **React frontend + Node/Express backend + Gemini** architecture. It is delivered in two compatible forms:

1. **Preview app (this repo root — Next.js).** React UI plus Next.js Route Handlers (`app/api/*`) that stand in for the Express backend so the app runs end-to-end in a single deployment (Vercel). AI calls go through the Vercel AI SDK + AI Gateway to a Google Gemini model.

2. **Standalone Express backend (`/backend`).** The same four endpoints implemented with Express controllers calling the Google Gemini SDK directly. This is what you deploy to **Render**; point a React frontend at its URL by swapping the `fetch` base path.

Both share identical request/response shapes and the same prompt-engineering strategy, so the frontend works against either.

## Request lifecycle (example: email)

1. User fills the form (purpose, tone, audience, key points) and submits.
2. Frontend `POST`s JSON to `/api/generate-email` (or the Express `/generate-email`).
3. The handler validates input and composes a **system instruction** (role/behavior) plus a **user prompt** (the task).
4. Gemini generates the email; the handler trims and returns `{ email }`.
5. The frontend renders the result with a copy button, behind a Responsible AI reminder.

## Components

- **Frontend state:** local React state per feature; the chatbot uses the AI SDK `useChat` hook to maintain conversation flow.
- **Prompt engineering:** centralized in each route/controller (see `docs/SAMPLE_PROMPTS.md`).
- **Error handling:** validation returns `400`; model/transport failures return `500` with a user-safe message.
- **Security:** input validation, CORS allow-list (Express), and baseline response headers.

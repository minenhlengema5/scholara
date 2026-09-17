# AI-Powered Workplace Productivity Assistant

A professional AI assistant that improves workplace productivity by automating common business tasks — writing emails, summarizing meetings, planning work, and answering workplace questions. Built with React, Node.js/Express, and the Google Gemini API.

> **Academic project.** This repository contains a runnable app, a standalone Express backend, documentation, and presentation content.

## Project Overview

The assistant provides one clean dashboard with four AI tools. It is delivered in two compatible forms that share the same endpoints and prompt strategy:

- **Preview app (repo root):** a React UI (Next.js) with Route Handlers that call Gemini via the Vercel AI SDK — runs end-to-end on **Vercel** with no separate server.
- **Standalone backend (`/backend`):** the same four endpoints as an **Express** service using the Google Gemini SDK — deploy to **Render** and point any React frontend at it.

## Features

1. **Smart Email Generator** — professional emails with tone (Formal / Informal / Persuasive) and audience (Client / Manager / Team Member).
2. **Meeting Notes Summarizer** — turns long notes into Key Discussion Points, Decisions Made, Action Items, and Deadlines.
3. **AI Task Planner** — prioritizes tasks by urgency & importance, builds daily/weekly schedules, and suggests productivity improvements.
4. **Workplace Chatbot ("Ava")** — interactive assistant that answers workplace questions and maintains conversation flow.

## Technologies Used

- **Frontend:** React (Next.js App Router), Tailwind CSS, shadcn/ui, lucide-react
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini (`gemini-2.5-flash`) — via the Vercel AI SDK + AI Gateway (preview app) or the `@google/generative-ai` SDK (Express backend)
- **Deployment:** Vercel (frontend), Render (backend)

## API Endpoints

| Method | Path                 | Body                                      | Returns         |
| ------ | -------------------- | ----------------------------------------- | --------------- |
| POST   | `/generate-email`    | `{ purpose, tone, audience, keyPoints }`  | `{ email }`     |
| POST   | `/summarize-meeting` | `{ notes }`                               | `{ summary }`   |
| POST   | `/plan-tasks`        | `{ tasks, horizon }`                      | `{ plan }`      |
| POST   | `/chat`              | `{ messages: [{ role, content }] }`       | `{ reply }`     |

*(In the Next.js preview app these are served under `/api/...`. In the Express backend they are served at the root paths above.)*

## Installation

### Preview app (Next.js)

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

AI works out of the box in v0/Vercel via the AI Gateway (no key needed). For a plain local run outside Vercel, set `AI_GATEWAY_API_KEY` in `.env.local`.

### Standalone backend (Express)

```bash
cd backend
cp .env.example .env    # add your GEMINI_API_KEY
npm install
npm run dev             # http://localhost:5000
```

Get a Gemini API key at https://aistudio.google.com/app/apikey.

## Prompt Engineering Strategy

Each feature separates a **system instruction** (persona + strict output format) from the **user prompt** (task + data). This yields consistent, renderable output and reduces hallucination. Guardrails instruct the model to never fabricate owners, dates, decisions, or confidential details. Full templates and examples: [`docs/SAMPLE_PROMPTS.md`](docs/SAMPLE_PROMPTS.md).

## Responsible AI Considerations

- **AI may generate inaccurate information.**
- **Human validation is required** before acting on any output.
- **Do not enter confidential information.**
- **Outputs should be reviewed before use.**

A Responsible AI reminder is shown on every feature, and prompts include anti-fabrication guardrails. Details: [`docs/RESPONSIBLE_AI.md`](docs/RESPONSIBLE_AI.md).

## Deployment Instructions

### Frontend → Vercel

1. Push this repo to GitHub.
2. Import it in Vercel and deploy (framework auto-detected as Next.js).
3. AI Gateway auth is automatic on Vercel — no AI keys to configure.

### Backend → Render

1. In Render, create a **Web Service** from the repo with root directory `backend`.
2. Build: `npm install` · Start: `npm start`.
3. Add env vars `GEMINI_API_KEY` and `CLIENT_ORIGIN` (your Vercel URL).
4. Deploy. To use it, change the frontend `fetch` calls to your Render base URL.

## Repository Structure

```
AI-Productivity-Assistant
├── app/                    # Next.js frontend + API route handlers (preview app)
│   ├── api/                #   /generate-email, /summarize-meeting, /plan-tasks, /chat
│   ├── page.tsx            #   dashboard shell
│   └── layout.tsx
├── components/             # UI: sidebar, feature views, markdown, banner
├── lib/                    # shared AI config
├── backend/                # standalone Express + Gemini API (deploy to Render)
├── docs/                   # ARCHITECTURE, RESPONSIBLE_AI, SAMPLE_PROMPTS
├── presentation/           # SLIDES.md (10-slide deck content)
└── README.md
```

## Architecture

```
User → React Frontend → Node.js Backend → Gemini API → AI Response
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full diagram and request lifecycle.

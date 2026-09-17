# Backend — AI Productivity Assistant (Express + Gemini)

Standalone Node.js/Express API that powers the assistant using the Google Gemini API. This is the service intended for deployment to **Render**. (The v0 preview app also ships equivalent Next.js Route Handlers so it runs without a separate server.)

## Endpoints

| Method | Path                 | Body                                  | Returns              |
| ------ | -------------------- | ------------------------------------- | -------------------- |
| POST   | `/generate-email`    | `{ purpose, tone, audience, keyPoints }` | `{ email }`      |
| POST   | `/summarize-meeting` | `{ notes }`                           | `{ summary }`        |
| POST   | `/plan-tasks`        | `{ tasks, horizon }`                  | `{ plan }`           |
| POST   | `/chat`              | `{ messages: [{ role, content }] }`   | `{ reply }`          |
| GET    | `/health`            | —                                     | `{ status: "ok" }`   |

## Local setup

```bash
cd backend
cp .env.example .env        # add your GEMINI_API_KEY
npm install
npm run dev                 # http://localhost:5000
```

## Environment variables

- `GEMINI_API_KEY` — Google Gemini API key (https://aistudio.google.com/app/apikey)
- `PORT` — server port (Render provides this automatically)
- `CLIENT_ORIGIN` — comma-separated allowed frontend origins for CORS

## Deploy to Render

1. Push this repo to GitHub.
2. In Render, create a **Web Service** from the repo, root directory `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add environment variables `GEMINI_API_KEY` and `CLIENT_ORIGIN` (your Vercel URL).
5. Deploy, then point the frontend at the resulting Render URL.

## Folder structure

```
backend
├── server.js               # Express app, middleware, error handling
├── routes/aiRoutes.js      # Route definitions
├── controllers/aiController.js  # Request handlers + prompt engineering
├── services/geminiService.js    # Gemini SDK wrapper
├── .env.example
└── package.json
```

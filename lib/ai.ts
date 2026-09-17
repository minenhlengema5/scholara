/**
 * Shared AI configuration for the Workplace Productivity Assistant.
 *
 * We use the Vercel AI SDK together with the AI Gateway. Passing a plain
 * "provider/model" string (here a Google Gemini model) routes the request
 * through the gateway, so no provider SDK or API key handling is needed in
 * the v0 preview or on Vercel. The standalone Express backend in /backend
 * demonstrates the same features against the raw Google Gemini API for the
 * Render deployment described in the README.
 */
export const GEMINI_MODEL = "google/gemini-2.5-flash"

/** Small helper so every route returns errors in the same shape. */
export function errorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status })
}

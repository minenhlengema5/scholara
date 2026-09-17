import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { LanguageModel } from "ai"

/**
 * Shared AI configuration for the Workplace Productivity Assistant.
 *
 * Real-life usage: set your own Google Gemini API key (from Google AI Studio,
 * free tier) as `GEMINI_API_KEY`. When present, every route calls the Gemini
 * API directly through the AI SDK's Google provider — no billing/credit card
 * and no Vercel AI Gateway required.
 *
 * If no Gemini key is set, we fall back to a plain "provider/model" string,
 * which routes through the Vercel AI Gateway (works on Vercel deployments
 * that have Gateway credits enabled).
 */
const GEMINI_MODEL_ID = "gemini-2.5-flash"
const GATEWAY_MODEL_ID = "google/gemini-2.5-flash"

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

/** True when a direct Google Gemini API key is configured. */
export const hasGeminiKey = Boolean(apiKey)

/**
 * The model every route uses. Resolved once at module load:
 * - direct Google Gemini provider when a key is present
 * - Gateway model string otherwise
 */
export const GEMINI_MODEL: LanguageModel = apiKey
  ? createGoogleGenerativeAI({ apiKey })(GEMINI_MODEL_ID)
  : GATEWAY_MODEL_ID

/** Small helper so every route returns errors in the same shape. */
export function errorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status })
}

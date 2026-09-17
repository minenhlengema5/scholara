import { generateText } from "ai"
import { GEMINI_MODEL, errorResponse } from "@/lib/ai"

/**
 * POST /api/generate-email
 * Body: { purpose, tone, audience, keyPoints? }
 * Returns a professional email draft (subject + body).
 */
export async function POST(req: Request) {
  try {
    const { purpose, tone, audience, keyPoints } = await req.json()

    if (!purpose || typeof purpose !== "string") {
      return errorResponse("A description of the email purpose is required.", 400)
    }

    const instructions = [
      "You are a professional workplace communication assistant.",
      "You write clear, well-structured business emails.",
      "Always return the result as: a single 'Subject:' line, a blank line, then the email body.",
      "Keep it concise, natural, and appropriate for a professional setting.",
      "Do not invent confidential details, names, or figures that were not provided.",
    ].join(" ")

    const prompt = [
      `Write a professional email.`,
      `Tone: ${tone || "formal"}.`,
      `Intended audience: ${audience || "colleague"}.`,
      `Purpose / context: ${purpose}.`,
      keyPoints ? `Key points to include: ${keyPoints}.` : "",
      `Sign off appropriately for the audience.`,
    ]
      .filter(Boolean)
      .join("\n")

    const { text } = await generateText({
      model: GEMINI_MODEL,
      instructions,
      prompt,
    })

    return Response.json({ email: text.trim() })
  } catch (err) {
    console.log("[v0] generate-email error:", err instanceof Error ? err.message : err)
    return errorResponse("Failed to generate email. Please try again.")
  }
}

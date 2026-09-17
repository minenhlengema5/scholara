import { generateText } from "ai"
import { GEMINI_MODEL, errorResponse } from "@/lib/ai"

/**
 * POST /api/summarize-meeting
 * Body: { notes }
 * Returns a structured markdown summary with key points, decisions,
 * action items, and deadlines.
 */
export async function POST(req: Request) {
  try {
    const { notes } = await req.json()

    if (!notes || typeof notes !== "string" || notes.trim().length < 20) {
      return errorResponse("Please provide meeting notes to summarize.", 400)
    }

    const instructions = [
      "You are a meticulous meeting-notes summarizer for a workplace productivity tool.",
      "Read raw meeting notes and produce a concise, well-organized summary.",
      "Return GitHub-flavored markdown using exactly these sections as level-3 headings:",
      "'### Summary', '### Key Discussion Points', '### Decisions Made', '### Action Items', '### Deadlines'.",
      "Use bullet points. For action items, include the owner in bold when it can be inferred (e.g. **Alex** — ...).",
      "If a section has no content, write '- None noted'. Never fabricate owners, dates, or decisions.",
    ].join(" ")

    const { text } = await generateText({
      model: GEMINI_MODEL,
      instructions,
      prompt: `Summarize the following meeting notes:\n\n${notes}`,
    })

    return Response.json({ summary: text.trim() })
  } catch (err) {
    console.log("[v0] summarize-meeting error:", err instanceof Error ? err.message : err)
    return errorResponse("Failed to summarize meeting notes. Please try again.")
  }
}

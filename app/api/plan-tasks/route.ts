import { generateText } from "ai"
import { GEMINI_MODEL, errorResponse } from "@/lib/ai"

/**
 * POST /api/plan-tasks
 * Body: { tasks, horizon: "daily" | "weekly" }
 * Returns a prioritized plan/schedule with productivity suggestions.
 */
export async function POST(req: Request) {
  try {
    const { tasks, horizon } = await req.json()

    if (!tasks || typeof tasks !== "string" || tasks.trim().length < 3) {
      return errorResponse("Please provide a list of tasks to plan.", 400)
    }

    const scope = horizon === "weekly" ? "weekly" : "daily"

    const instructions = [
      "You are an AI task planner for busy professionals.",
      "Given a list of tasks, prioritize them using urgency and importance (an Eisenhower-style view).",
      "Return GitHub-flavored markdown with these level-3 headings:",
      "'### Prioritized Tasks' (a table with columns Task | Priority | Reason),",
      `'### ${scope === "weekly" ? "Weekly Schedule" : "Daily Schedule"}' (a realistic time-blocked plan),`,
      "'### Productivity Suggestions' (3-5 concrete, actionable tips based on the workload).",
      "Be realistic about how much fits in the available time. Do not invent tasks the user did not mention.",
    ].join(" ")

    const prompt = `Create a ${scope} plan for the following tasks:\n\n${tasks}`

    const { text } = await generateText({
      model: GEMINI_MODEL,
      instructions,
      prompt,
    })

    return Response.json({ plan: text.trim() })
  } catch (err) {
    console.log("[v0] plan-tasks error:", err instanceof Error ? err.message : err)
    return errorResponse("Failed to build the task plan. Please try again.")
  }
}

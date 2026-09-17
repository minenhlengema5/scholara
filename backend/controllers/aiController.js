import { generateContent, generateChatReply } from "../services/geminiService.js"

/**
 * Controllers for the four AI features. Each validates input, builds a
 * prompt with a clear system instruction (prompt engineering lives here),
 * calls Gemini, and returns JSON. Errors are passed to the Express error
 * handler in server.js.
 */

// POST /generate-email
export async function generateEmail(req, res, next) {
  try {
    const { purpose, tone = "formal", audience = "colleague", keyPoints = "" } = req.body || {}
    if (!purpose || typeof purpose !== "string") {
      return res.status(400).json({ error: "A description of the email purpose is required." })
    }

    const systemInstruction =
      "You are a professional workplace communication assistant. You write clear, well-structured " +
      "business emails. Always return a single 'Subject:' line, a blank line, then the email body. " +
      "Keep it concise and professional. Never invent confidential details that were not provided."

    const prompt = [
      "Write a professional email.",
      `Tone: ${tone}.`,
      `Intended audience: ${audience}.`,
      `Purpose / context: ${purpose}.`,
      keyPoints ? `Key points to include: ${keyPoints}.` : "",
      "Sign off appropriately for the audience.",
    ]
      .filter(Boolean)
      .join("\n")

    const email = await generateContent(systemInstruction, prompt)
    res.json({ email })
  } catch (err) {
    next(err)
  }
}

// POST /summarize-meeting
export async function summarizeMeeting(req, res, next) {
  try {
    const { notes } = req.body || {}
    if (!notes || typeof notes !== "string" || notes.trim().length < 20) {
      return res.status(400).json({ error: "Please provide meeting notes to summarize." })
    }

    const systemInstruction =
      "You are a meticulous meeting-notes summarizer. Return GitHub-flavored markdown with these level-3 " +
      "headings exactly: '### Summary', '### Key Discussion Points', '### Decisions Made', '### Action Items', " +
      "'### Deadlines'. Use bullet points. Bold action-item owners when inferable. If a section is empty, write " +
      "'- None noted'. Never fabricate owners, dates, or decisions."

    const summary = await generateContent(systemInstruction, `Summarize the following meeting notes:\n\n${notes}`)
    res.json({ summary })
  } catch (err) {
    next(err)
  }
}

// POST /plan-tasks
export async function planTasks(req, res, next) {
  try {
    const { tasks, horizon = "daily" } = req.body || {}
    if (!tasks || typeof tasks !== "string" || tasks.trim().length < 3) {
      return res.status(400).json({ error: "Please provide a list of tasks to plan." })
    }
    const scope = horizon === "weekly" ? "weekly" : "daily"

    const systemInstruction =
      "You are an AI task planner. Prioritize tasks using urgency and importance. Return GitHub-flavored " +
      "markdown with headings: '### Prioritized Tasks' (a table Task | Priority | Reason), " +
      `'### ${scope === "weekly" ? "Weekly Schedule" : "Daily Schedule"}' (a realistic time-blocked plan), ` +
      "and '### Productivity Suggestions' (3-5 concrete tips). Be realistic and never invent tasks."

    const plan = await generateContent(systemInstruction, `Create a ${scope} plan for these tasks:\n\n${tasks}`)
    res.json({ plan })
  } catch (err) {
    next(err)
  }
}

// POST /chat
export async function chat(req, res, next) {
  try {
    const { messages } = req.body || {}
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "A non-empty messages array is required." })
    }

    const systemInstruction =
      "You are 'Ava', a friendly and knowledgeable workplace productivity assistant. Answer workplace-related " +
      "questions about communication, meetings, time management, prioritization, and collaboration. Keep answers " +
      "practical and concise. Remind users to verify important information and avoid sharing confidential data."

    const reply = await generateChatReply(systemInstruction, messages)
    res.json({ reply })
  } catch (err) {
    next(err)
  }
}

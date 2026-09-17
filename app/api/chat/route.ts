import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { GEMINI_MODEL } from "@/lib/ai"

export const maxDuration = 30

/**
 * POST /api/chat
 * Body: { messages: UIMessage[] }
 * Streams an assistant reply. Used by the Workplace Chatbot via useChat,
 * which keeps conversation flow/history on the client.
 */
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: GEMINI_MODEL,
    instructions: [
      "You are 'Ava', a friendly and knowledgeable workplace productivity assistant.",
      "Answer workplace-related questions: communication, meetings, time management,",
      "prioritization, collaboration, tools, and professional etiquette.",
      "Keep answers practical and concise. Use short paragraphs or bullet points.",
      "If a question is outside a professional/workplace context, gently steer back.",
      "Remind users to verify important information and never share confidential data when relevant.",
    ].join(" "),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}

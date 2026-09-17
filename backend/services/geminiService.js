import { GoogleGenerativeAI } from "@google/generative-ai"

/**
 * Thin wrapper around the Google Gemini SDK so every controller shares one
 * configured client and model. The API key is read from the environment and
 * must never be committed (see .env.example).
 */
const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn("[backend] GEMINI_API_KEY is not set. AI requests will fail until it is configured.")
}

const genAI = new GoogleGenerativeAI(apiKey || "")

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
})

/**
 * Generate text from a system instruction + user prompt.
 * @param {string} systemInstruction - Role/behavior guidance for the model.
 * @param {string} prompt - The user content to act on.
 * @returns {Promise<string>} The generated text.
 */
export async function generateContent(systemInstruction, prompt) {
  const result = await model.generateContent({
    systemInstruction,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  })
  return result.response.text().trim()
}

/**
 * Generate a chat reply from a running conversation.
 * @param {string} systemInstruction - Role/behavior guidance for the model.
 * @param {{ role: "user" | "assistant", content: string }[]} messages - History.
 * @returns {Promise<string>} The assistant reply.
 */
export async function generateChatReply(systemInstruction, messages) {
  // The last message is the newest user turn; everything before it is history.
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))
  const latest = messages[messages.length - 1]

  const chat = model.startChat({ systemInstruction, history })
  const result = await chat.sendMessage(latest.content)
  return result.response.text().trim()
}

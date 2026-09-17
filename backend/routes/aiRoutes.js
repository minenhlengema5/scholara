import { Router } from "express"
import { generateEmail, summarizeMeeting, planTasks, chat } from "../controllers/aiController.js"

/**
 * All AI feature routes. Mounted at the app root in server.js so the paths
 * match the assignment spec exactly:
 *   POST /generate-email
 *   POST /summarize-meeting
 *   POST /plan-tasks
 *   POST /chat
 */
const router = Router()

router.post("/generate-email", generateEmail)
router.post("/summarize-meeting", summarizeMeeting)
router.post("/plan-tasks", planTasks)
router.post("/chat", chat)

export default router

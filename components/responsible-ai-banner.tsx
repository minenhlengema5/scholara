import { ShieldAlert } from "lucide-react"

/**
 * Persistent reminder shown on every AI feature so users always see the
 * Responsible AI guidance before acting on generated output.
 */
export function ResponsibleAiBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        AI can make mistakes and may generate inaccurate information. Always review outputs before use, apply human
        judgment, and never enter confidential or sensitive data.
      </p>
    </div>
  )
}

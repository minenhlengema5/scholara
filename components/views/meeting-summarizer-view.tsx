"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ResponsibleAiBanner } from "@/components/responsible-ai-banner"
import { Markdown } from "@/components/markdown"
import { Loader2, FileText, Wand2 } from "lucide-react"

const SAMPLE = `Weekly product sync - attendees: Priya, Marcus, Dana, Leo.
Priya opened with the onboarding funnel numbers: sign-up completion dropped 12% after the new email verification step. Marcus argued the extra step is needed for security/compliance. Dana suggested making verification optional for the first session and enforcing it before the second login. Group agreed to A/B test Dana's approach for two weeks starting Monday. Leo will build the experiment; Priya will define success metrics by Wednesday. Marcus raised concern about the mobile checkout bug - it's causing ~3% of payments to fail. Decision: treat as P1, Leo to hotfix by end of week. Dana mentioned the design system migration is behind; she'll share a revised timeline next Tuesday. We also agreed to move the standup to 9:30am.`

export function MeetingSummarizerView() {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [summary, setSummary] = useState("")

  async function handleSummarize() {
    if (notes.trim().length < 20) {
      setError("Please paste more detailed meeting notes.")
      return
    }
    setLoading(true)
    setError("")
    setSummary("")
    try {
      const res = await fetch("/api/summarize-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Meeting Notes Summarizer</h1>
            <p className="text-sm text-muted-foreground">
              Turn long notes into key points, decisions, action items, and deadlines.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setNotes(SAMPLE)} type="button">
          <Wand2 className="size-4" /> Load sample
        </Button>
      </header>

      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="notes">Paste your meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw meeting notes, transcript, or bullet points here..."
              className="min-h-72 resize-y"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleSummarize} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {loading ? "Summarizing..." : "Summarize Notes"}
          </Button>
        </Card>

        <Card className="flex min-h-72 flex-col p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Summary</h2>
          {summary ? (
            <Markdown>{summary}</Markdown>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

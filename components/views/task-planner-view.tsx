"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsibleAiBanner } from "@/components/responsible-ai-banner"
import { Markdown } from "@/components/markdown"
import { Loader2, ListChecks, Wand2 } from "lucide-react"

const SAMPLE = `- Prepare slide deck for Thursday client pitch
- Reply to 20+ unread support emails
- Review pull request from new engineer
- Book flights for next month's conference
- Draft Q4 OKRs (due end of week)
- Fix the login bug reported by two customers
- 1:1 with each of my 3 direct reports
- Update the team wiki`

export function TaskPlannerView() {
  const [tasks, setTasks] = useState("")
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState("")

  async function handlePlan() {
    if (tasks.trim().length < 3) {
      setError("Please add at least one task.")
      return
    }
    setLoading(true)
    setError("")
    setPlan("")
    try {
      const res = await fetch("/api/plan-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, horizon }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setPlan(data.plan)
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
            <ListChecks className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Task Planner</h1>
            <p className="text-sm text-muted-foreground">
              Prioritize tasks, build a schedule, and get productivity tips.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setTasks(SAMPLE)} type="button">
          <Wand2 className="size-4" /> Load sample
        </Button>
      </header>

      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="tasks">List your tasks</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="One task per line. Include deadlines or context where helpful."
              className="min-h-60 resize-y"
            />
          </div>

          <div className="grid gap-2">
            <Label>Schedule type</Label>
            <Tabs value={horizon} onValueChange={(v) => setHorizon(v as "daily" | "weekly")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handlePlan} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ListChecks className="size-4" />}
            {loading ? "Planning..." : "Create Plan"}
          </Button>
        </Card>

        <Card className="flex min-h-60 flex-col p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Your Plan</h2>
          {plan ? (
            <Markdown>{plan}</Markdown>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              Your prioritized schedule will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

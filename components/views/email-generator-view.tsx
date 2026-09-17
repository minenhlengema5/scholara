"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResponsibleAiBanner } from "@/components/responsible-ai-banner"
import { Loader2, Copy, Check, Mail, Wand2 } from "lucide-react"

const SAMPLE = {
  purpose: "Follow up on the delayed Q3 marketing report and request an updated delivery date.",
  tone: "formal",
  audience: "manager",
  keyPoints: "Report was due last Friday; blocking the campaign launch; propose a quick 15-min sync.",
}

export function EmailGeneratorView() {
  const [purpose, setPurpose] = useState("")
  const [tone, setTone] = useState("formal")
  const [audience, setAudience] = useState("client")
  const [keyPoints, setKeyPoints] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!purpose.trim()) {
      setError("Please describe what the email is about.")
      return
    }
    setLoading(true)
    setError("")
    setResult("")
    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, tone, audience, keyPoints }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Request failed")
      setResult(data.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  function loadSample() {
    setPurpose(SAMPLE.purpose)
    setTone(SAMPLE.tone)
    setAudience(SAMPLE.audience)
    setKeyPoints(SAMPLE.keyPoints)
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Smart Email Generator</h1>
            <p className="text-sm text-muted-foreground">Draft professional emails by tone and audience.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadSample} type="button">
          <Wand2 className="size-4" /> Load sample
        </Button>
      </header>

      <ResponsibleAiBanner />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="purpose">What is the email about?</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request an extension on the project deadline"
              className="min-h-24 resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="audience">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keyPoints">Key points (optional)</Label>
            <Input
              id="keyPoints"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Comma-separated points to include"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            {loading ? "Generating..." : "Generate Email"}
          </Button>
        </Card>

        <Card className="flex min-h-64 flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Generated Email</h2>
            {result && (
              <Button variant="ghost" size="sm" onClick={copyResult} type="button">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          {result ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{result}</pre>
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Markdown } from "@/components/markdown"
import { cn } from "@/lib/utils"
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react"

const SUGGESTIONS = [
  "How do I write a polite decline to a meeting invite?",
  "Give me an agenda template for a 30-minute team sync.",
  "How can I prioritize when everything feels urgent?",
  "Tips for staying focused during deep work?",
]

export function ChatbotView() {
  const { messages, sendMessage, status } = useChat()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const isBusy = status === "submitted" || status === "streaming"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isBusy) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <header className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquare className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Workplace Chatbot</h1>
          <p className="text-sm text-muted-foreground">Ask Ava about communication, meetings, and productivity.</p>
        </div>
      </header>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Hi, I&apos;m Ava.</p>
                <p className="text-sm text-muted-foreground">Ask me anything about your workday.</p>
              </div>
              <div className="grid w-full max-w-md gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      message.role === "assistant" ? (
                        <Markdown key={i}>{part.text}</Markdown>
                      ) : (
                        <span key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      )
                    ) : null,
                  )}
                </div>
              </div>
            ))
          )}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Ava is thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            aria-label="Message"
            disabled={isBusy}
          />
          <Button type="submit" size="icon" disabled={isBusy || !input.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}

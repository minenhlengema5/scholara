"use client"

import { useState } from "react"
import { AppSidebar, type ViewId } from "@/components/app-sidebar"
import { DashboardView } from "@/components/views/dashboard-view"
import { EmailGeneratorView } from "@/components/views/email-generator-view"
import { MeetingSummarizerView } from "@/components/views/meeting-summarizer-view"
import { TaskPlannerView } from "@/components/views/task-planner-view"
import { ChatbotView } from "@/components/views/chatbot-view"
import { Menu } from "lucide-react"

export default function Page() {
  const [view, setView] = useState<ViewId>("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)

  function select(id: ViewId) {
    setView(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AppSidebar
        active={view}
        onSelect={select}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-foreground hover:bg-accent"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold">Productivity AI</span>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="mx-auto h-full max-w-5xl">
            {view === "dashboard" && <DashboardView onSelect={select} />}
            {view === "email" && <EmailGeneratorView />}
            {view === "meeting" && <MeetingSummarizerView />}
            {view === "tasks" && <TaskPlannerView />}
            {view === "chat" && <ChatbotView />}
          </div>
        </main>
      </div>
    </div>
  )
}

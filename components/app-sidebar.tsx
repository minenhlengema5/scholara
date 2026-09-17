"use client"

import { LayoutDashboard, Mail, FileText, ListChecks, MessageSquare, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewId = "dashboard" | "email" | "meeting" | "tasks" | "chat"

export const NAV_ITEMS: {
  id: ViewId
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: "dashboard", label: "Dashboard", description: "Overview", icon: LayoutDashboard },
  { id: "email", label: "Email Generator", description: "Draft professional emails", icon: Mail },
  { id: "meeting", label: "Meeting Summarizer", description: "Summarize notes", icon: FileText },
  { id: "tasks", label: "Task Planner", description: "Prioritize & schedule", icon: ListChecks },
  { id: "chat", label: "Workplace Chatbot", description: "Ask Ava anything", icon: MessageSquare },
]

export function AppSidebar({
  active,
  onSelect,
  mobileOpen,
  onCloseMobile,
}: {
  active: ViewId
  onSelect: (id: ViewId) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Productivity AI</p>
              <p className="text-xs text-sidebar-foreground/60">Workplace Assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/50",
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="px-5 py-4 text-xs text-sidebar-foreground/50">
          <p>Powered by Google Gemini</p>
          <p className="mt-1">Review all AI output before use.</p>
        </div>
      </aside>
    </>
  )
}

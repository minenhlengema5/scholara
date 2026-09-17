"use client"

import { Card } from "@/components/ui/card"
import { NAV_ITEMS, type ViewId } from "@/components/app-sidebar"
import { ResponsibleAiBanner } from "@/components/responsible-ai-banner"
import { ArrowRight } from "lucide-react"

export function DashboardView({ onSelect }: { onSelect: (id: ViewId) => void }) {
  const features = NAV_ITEMS.filter((item) => item.id !== "dashboard")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your AI toolkit for faster, clearer, and more organized work. Choose a tool to get started.
        </p>
      </div>

      <ResponsibleAiBanner />

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(feature.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(feature.id)
                }
              }}
              className="group cursor-pointer p-5 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">{feature.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

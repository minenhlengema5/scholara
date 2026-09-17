import ReactMarkdown from "react-markdown"

/**
 * Lightweight markdown renderer with Tailwind styling.
 * Used to display structured AI output (summaries, task plans, chat replies)
 * without pulling in the typography plugin.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-lg font-semibold text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold text-foreground">{children}</h2>,
          h3: ({ children }) => (
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">{children}</h3>
          ),
          p: ({ children }) => <p className="text-foreground/90">{children}</p>,
          ul: ({ children }) => <ul className="ml-4 list-disc space-y-1 text-foreground/90">{children}</ul>,
          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1 text-foreground/90">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{children}</code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border border-border px-3 py-2 align-top">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

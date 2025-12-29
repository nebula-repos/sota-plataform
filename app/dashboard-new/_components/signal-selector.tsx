"use client"

import { Check, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FilterState } from "./signal-selector"

// Keep this type export for the other file
export type { FilterState }

interface SignalSelectorProps {
  filters: FilterState
  onToggle: (key: string) => void
  currentViewFilter?: string
  onViewFilterChange?: (view: string) => void
}

const signals = [
  { id: "all", label: "All Signals", count: 12 },
  { id: "academic", label: "Academic Research", count: 4 },
  { id: "industrial", label: "Industrial Moves", count: 3 },
  { id: "pricing", label: "Pricing & Packaging", count: 2 },
  { id: "competitor", label: "Competitor Intelligence", count: 2 },
  { id: "regulation", label: "Regulatory Changes", count: 1 },
]

export function SignalSelector({ filters, onToggle, currentViewFilter, onViewFilterChange }: SignalSelectorProps) {

  const handleSavedViewClick = (view: string) => {
    if (onViewFilterChange) {
      onViewFilterChange(view)
    }
  }

  return (
    <div className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hidden lg:block transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Signal Sources</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-3">
          {signals.map((signal) => {
            const isActive = filters[signal.id]
            return (
              <button
                key={signal.id}
                onClick={() => onToggle(signal.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md p-3 text-sm font-medium transition-all mb-1",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    isActive ? "border-blue-700 bg-blue-700 text-white" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  )}>
                    {isActive && <Check className="h-3 w-3" />}
                  </div>
                  <span>{signal.label}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{signal.count}</span>
              </button>
            )
          })}
        </div>

        <div className="p-4 mt-4 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Saved Views</h2>
          <div className="space-y-1">
            <button
              onClick={() => handleSavedViewClick('saved')}
              className={cn(
                "flex w-full items-center gap-2 p-2 text-sm font-medium rounded-md transition-all",
                currentViewFilter === 'saved' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
              )}
            >
              <Star className="h-4 w-4 text-amber-500" />
              <span>Saved Signals</span>
            </button>
            <button
              onClick={() => handleSavedViewClick('competitor_watch')}
              className={cn(
                "flex w-full items-center gap-2 p-2 text-sm font-medium rounded-md transition-all",
                currentViewFilter === 'competitor_watch' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm"
              )}
            >
              <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>Competitor Watch</span>
            </button>
          </div>
        </div>

      </ScrollArea>
    </div>
  )
}

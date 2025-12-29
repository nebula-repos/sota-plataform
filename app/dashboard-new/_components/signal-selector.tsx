"use client"

import { Check, Star, Users, Sparkles, AlertCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { enrichedSignals, Signal, SIGNAL_TYPE_LABELS } from "@/app/dashboard-new/_lib/mock-data"

export interface SignalListProps {
  selectedSignalId: number | null
  onSelectSignal: (id: number) => void
  currentViewFilter?: string
  onViewFilterChange?: (view: string) => void
  savedSignalIds: number[]
  searchQuery: string
}

export function SignalList({ selectedSignalId, onSelectSignal, currentViewFilter, onViewFilterChange, savedSignalIds, searchQuery }: SignalListProps) {

  const handleSavedViewClick = (view: string) => {
    if (onViewFilterChange) {
      onViewFilterChange(view)
    }
  }

  // Filter signals based on current view and search query
  const filteredSignals = enrichedSignals.filter(signal => {
    // 1. Filter by View
    if (currentViewFilter === 'saved' && !savedSignalIds.includes(signal.id)) {
      return false
    }

    // 2. Filter by Search Query
    if (searchQuery && !signal.title.toLowerCase().includes(searchQuery.toLowerCase()) && !SIGNAL_TYPE_LABELS[signal.type].toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">View</h2>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleSavedViewClick('all')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-2 text-xs font-medium rounded-md transition-all border",
              !currentViewFilter || currentViewFilter === 'all'
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <Sparkles className="h-3 w-3" />
            Signals
          </button>
          <button
            onClick={() => handleSavedViewClick('saved')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-2 text-xs font-medium rounded-md transition-all border",
              currentViewFilter === 'saved'
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <Star className="h-3 w-3" />
            Saved
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredSignals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3 text-gray-400">
                {currentViewFilter === 'saved' ? <Star className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">No signals found</p>
              <p className="text-xs text-gray-500 mt-1">
                {currentViewFilter === 'saved' ? "Bookmark signals to see them here." : "Try adjusting filters or checking back later."}
              </p>
            </div>
          ) : (
            filteredSignals.map((signal) => {
              const isActive = selectedSignalId === signal.id
              const isSaved = savedSignalIds.includes(signal.id)

              return (
                <button
                  key={signal.id}
                  onClick={() => onSelectSignal(signal.id)}
                  className={cn(
                    "flex flex-col w-full text-left rounded-lg p-3 transition-all border group relative",
                    isActive
                      ? "bg-white dark:bg-gray-800 border-blue-500 dark:border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20"
                      : "bg-white/50 dark:bg-gray-900/50 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                  )}
                >
                  <div className="flex items-start justify-between w-full mb-1">
                    <span className={cn(
                      "uppercase tracking-wider text-[11px] font-bold",
                      isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {SIGNAL_TYPE_LABELS[signal.type]}
                    </span>
                    <div className="flex items-center gap-2">
                      {isSaved && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                      <span className="text-[10px] text-gray-400 shrink-0">{signal.date}</span>
                    </div>
                  </div>

                  <h3 className={cn(
                    "text-sm font-medium leading-snug mb-2 line-clamp-2",
                    isActive ? "text-blue-950 dark:text-blue-50" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {signal.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-auto">
                    {signal.impact === 'high' && (
                      <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-500">
                        <AlertCircle className="h-3 w-3" />
                        High Impact
                      </div>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

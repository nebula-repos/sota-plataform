"use client"

import React from 'react'

import { Signal, SIGNAL_TYPE_LABELS, SIGNAL_TYPE_DEFINITIONS } from "@/app/dashboard-new/_lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RevenueChart } from "./charts/revenue-chart"
import { CorrelationChart } from "./charts/correlation-chart"
import { MarketMapChart } from "./charts/market-map-chart"
import { Share2, Bookmark, Download, ExternalLink, TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface SignalDetailViewProps {
  signal: Signal
  onToggleSave: (id: number) => void
  isSaved: boolean
  onSelectSignal: (id: number) => void
}

import { Toaster, toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SignalDetailView({ signal, onToggleSave, isSaved, onSelectSignal }: SignalDetailViewProps) {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: signal.title,
          text: `Check out this signal: ${signal.title}`,
          url: window.location.href,
        })
        toast.success("Shared successfully")
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err)
          toast.error("Failed to share")
        }
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 uppercase tracking-wide">
            {SIGNAL_TYPE_LABELS[signal.type]}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              {signal.sources.slice(0, 3).map((source, i) => (
                <React.Fragment key={i}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-blue-600 hover:underline transition-colors">
                    {source.name}
                  </a>
                  {i < Math.min(signal.sources.length, 3) - 1 ? "," : ""}
                </React.Fragment>
              ))}
              {signal.sources.length > 3 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ml-1">
                      +{signal.sources.length - 3}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
                    {signal.sources.slice(3).map((source, i) => (
                      <DropdownMenuItem key={i} asChild>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                          {source.name}
                          <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <span>•</span>
            <span>{signal.date}</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {signal.title}
        </h1>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={isSaved ? "default" : "outline"}
            className={isSaved ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave(signal.id)
            }}
          >
            <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save Signal"}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {signal.metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span className={`flex items-center text-sm font-medium ${metric.trend === 'positive' ? 'text-green-600 dark:text-green-400' :
                  metric.trend === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                  }`}>
                  {metric.trend === 'positive' && <TrendingUp className="mr-1 h-3 w-3" />}
                  {metric.trend === 'negative' && <TrendingDown className="mr-1 h-3 w-3" />}
                  {metric.trend === 'neutral' && <Minus className="mr-1 h-3 w-3" />}
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Summary / Analysis */}
      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Intelligence Analysis</h2>
          <div className="prose prose-slate dark:prose-invert w-full max-w-full prose-h2:text-0 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-p:text-gray-700 dark:prose-p:text-gray-300 break-words prose-pre:whitespace-pre-wrap prose-pre:break-words prose-li:marker:text-blue-500 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic">
            <ReactMarkdown>{signal.fullAnalysis}</ReactMarkdown>
          </div>
        </section>

        {/* Charts */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
          {(!signal.chartType || signal.chartType === 'revenue') && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Revenue Impact Projection</h3>
                <Badge variant="secondary">Forecast</Badge>
              </div>
              <RevenueChart />
              <p className="text-xs text-center text-gray-400 mt-4">Projected impact over next 4 quarters based on current market model.</p>
            </>
          )}

          {signal.chartType === 'correlation' && signal.correlationData && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Market Correlation</h3>
                <Badge variant="secondary">Clustering</Badge>
              </div>
              <CorrelationChart
                data={signal.correlationData.points}
                xLabel={signal.correlationData.xLabel}
                yLabel={signal.correlationData.yLabel}
              />
              <p className="text-xs text-center text-gray-400 mt-4">Correlation analysis of key market variables.</p>
            </>
          )}

          {signal.chartType === 'marketMap' && signal.marketMapData && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Strategic Positioning</h3>
                <Badge variant="secondary">Market Map</Badge>
              </div>
              <MarketMapChart
                data={signal.marketMapData.points}
                xLabel={signal.marketMapData.xLabel}
                yLabel={signal.marketMapData.yLabel}
                quadrants={signal.marketMapData.quadrants}
              />
              <p className="text-xs text-center text-gray-400 mt-4">Competitive landscape positioning based on feature set and pricing.</p>
            </>
          )}
        </section>

        {/* Data Table */}
        {signal.tableData && (
          <section>
            <h3 className="text-lg font-bold mb-4">Comparative Data</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  <tr>
                    {signal.tableData.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {signal.tableData.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200 first:font-semibold">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Related Signals (Now at Bottom) */}
        <section className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-6">Related Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signal.relatedSignals.length > 0 ? signal.relatedSignals.map(related => (
              <Card
                key={related.id}
                className="group cursor-pointer hover:shadow-md transition-all border-blue-100 dark:border-blue-800/50 bg-white dark:bg-gray-900/50"
                onClick={() => onSelectSignal(related.id)}
              >
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>{related.date}</span>
                    <span>•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium ml-auto">View Signal &rarr;</span>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-sm text-gray-500">No related signals found.</p>
            )}
          </div>
        </section>
      </div>

    </div>
  )
}

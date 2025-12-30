import { ArrowRight, MoreHorizontal, TrendingUp, TrendingDown, Minus, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SignalType = "academic" | "industrial" | "pricing" | "competitor" | "regulation"

export interface SignalCardProps {
  type: SignalType
  title: string
  source: string
  date: string
  impact?: "high" | "medium" | "low"
  trend?: "up" | "down" | "neutral"
  description: string
  children?: React.ReactNode
  onViewDetails?: () => void
  onSave?: () => void
  isSaved?: boolean
}

const typeStyles: Record<SignalType, { label: string, color: string, badge: string }> = {
  academic: { label: "Academic Research", color: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" },
  industrial: { label: "Industrial Move", color: "text-gray-700 dark:text-gray-300", badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" },
  pricing: { label: "Pricing Change", color: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" },
  competitor: { label: "Competitor Action", color: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" },
  regulation: { label: "Regulation", color: "text-gray-600 dark:text-gray-400", badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" },
}

export function SignalCard({ type, title, source, date, impact, trend, description, children, onViewDetails, onSave, isSaved }: SignalCardProps) {
  const style = typeStyles[type]

  return (
    <Card className="flex flex-col border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`${style.badge} font-medium`}>
            {style.label}
          </Badge>

          <div className="flex items-center gap-1">
            {isSaved && (
              <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                <DropdownMenuItem onClick={onSave} className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isSaved ? "Unsave Signal" : "Save Signal"}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                  Share internals
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
        <CardTitle className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
          <span>•</span>
          <span>{date}</span>
          {impact === 'high' && (
            <span className="ml-auto font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              High Impact
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {description}
        </p>

        {children && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            {children}
          </div>
        )}

      </CardContent>
      <CardFooter className="pt-0 border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl flex justify-between items-center text-xs">
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-500" />}
          {trend === 'neutral' && <Minus className="h-3 w-3 text-gray-400 dark:text-gray-500" />}
          {trend && <span className="uppercase font-semibold tracking-wider">Trend</span>}
        </div>

        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-blue-700 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 hover:no-underline group/btn"
          onClick={onViewDetails}
        >
          View Details
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

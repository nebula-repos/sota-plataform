import { Signal } from "./signal.interface"

export interface SignalDetailViewProps {
  signal: Signal
  onToggleSave: (id: number | string) => void
  isSaved: boolean
  onSelectSignal: (id: number | string) => void
}

export interface SignalListProps {
  signals: any[]
  selectedSignalId: number | string | null
  onSelectSignal: (id: number | string) => void
  currentViewFilter?: string
  onViewFilterChange?: (view: string) => void
  savedSignalIds: (number | string)[]
  searchQuery: string
}

export interface DashboardHeaderProps {
  currentView: string
  onNavigate: (view: string) => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
  isSuperAdmin?: boolean
}

export interface MarketMapChartProps {
  data: { x: number; y: number; label: string; color?: string }[]
  xLabel: string
  yLabel: string
  quadrants: [string, string, string, string]
}

export interface CorrelationChartProps {
  data: { x: number; y: number; label: string; company: string }[]
  xLabel: string
  yLabel: string
}

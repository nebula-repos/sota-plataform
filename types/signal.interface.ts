export type SignalType = "academic" | "industrial" | "pricing" | "competitor" | "regulation";

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "positive" | "negative" | "neutral";
}

export interface RelatedSignal {
  id: number | string;
  title: string;
  date: string;
}

export interface Source {
  name: string
  url: string
}

export interface CorrelationData {
  xLabel: string;
  yLabel: string;
  points: { x: number; y: number; label: string; company: string }[];
}

export interface MarketMapData {
  xLabel: string; // e.g. "Price"
  yLabel: string; // e.g. "Feature Completeness"
  quadrants: [string, string, string, string]; // Top-Right, Top-Left, Bottom-Left, Bottom-Right
  points: { x: number; y: number; label: string; color?: string }[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface Signal {
  id: number | string
  type: SignalType | string // Allow string for flexibility with DB data that might not match exactly yet
  title: string
  summary?: string // Present in some usages
  description?: string
  date: string
  time: string
  impact?: 'high' | 'medium' | 'low'
  score?: number
  source?: string
  sources?: Source[]
  metrics?: Metric[]
  fullAnalysis?: string
  relatedSignals?: RelatedSignal[]
  chartType?: 'revenue' | 'correlation' | 'marketMap' | string
  revenueData?: any
  correlationData?: CorrelationData
  marketMapData?: MarketMapData
  tableData?: TableData
}

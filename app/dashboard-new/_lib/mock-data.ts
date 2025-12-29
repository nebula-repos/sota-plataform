export type SignalType = "academic" | "industrial" | "pricing" | "competitor" | "regulation";

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  academic: "Academic Research",
  industrial: "Competitive Move",
  pricing: "Pricing Update",
  competitor: "Competitor Intel",
  regulation: "Regulation Alert"
};

export const SIGNAL_TYPE_DEFINITIONS: Record<SignalType, string> = {
  academic: "Deep dives into the latest academic papers and research breakthroughs that characterize the bleeding edge of technology.",
  industrial: "Strategic analysis of major market moves, mergers, acquisitions, and broad industrial shifts affecting the sector.",
  pricing: "Detailed tracking of competitor pricing models, SKU changes, and discounting strategies across the vertical.",
  competitor: "Real-time intelligence on competitor product launches, feature updates, and go-to-market strategy adjustments.",
  regulation: "Alerts on new legislative frameworks, compliance deadlines, and regulatory risks affecting AI and data privacy."
};

export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "positive" | "negative" | "neutral";
}

export interface RelatedSignal {
  id: number;
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
  id: number
  type: SignalType
  title: string
  description: string
  date: string
  time: string
  impact: 'high' | 'medium' | 'low'
  sources: Source[]
  metrics: Metric[]
  fullAnalysis: string
  relatedSignals: RelatedSignal[]
  chartType?: 'revenue' | 'correlation' | 'marketMap'
  correlationData?: CorrelationData
  marketMapData?: MarketMapData
  tableData?: TableData
}

// Helper to generate many sources deterministically
const generateSources = (count: number, offset: number = 0): Source[] => {
  const sources = [
    { name: "Bloomberg", url: "https://www.bloomberg.com" },
    { name: "Reuters", url: "https://www.reuters.com" },
    { name: "Financial Times", url: "https://www.ft.com" },
    { name: "Wall Street Journal", url: "https://www.wsj.com" },
    { name: "TechCrunch", url: "https://techcrunch.com" },
    { name: "The Verge", url: "https://www.theverge.com" },
    { name: "VentureBeat", url: "https://venturebeat.com" },
    { name: "Forbes", url: "https://www.forbes.com" },
    { name: "Business Insider", url: "https://www.businessinsider.com" },
    { name: "CNBC", url: "https://www.cnbc.com" },
    { name: "MarketWatch", url: "https://www.marketwatch.com" },
    { name: "Seeking Alpha", url: "https://seekingalpha.com" },
    { name: "Investopedia", url: "https://www.investopedia.com" },
    { name: "Morningstar", url: "https://www.morningstar.com" },
    { name: "Yahoo Finance", url: "https://finance.yahoo.com" },
    { name: "Google Finance", url: "https://www.google.com/finance" },
    { name: "SEC Filings", url: "https://www.sec.gov" },
    { name: "Patent Office", url: "https://www.uspto.gov" },
    { name: "Glassdoor", url: "https://www.glassdoor.com" },
    { name: "LinkedIn", url: "https://www.linkedin.com" }
  ]

  // Deterministic circular slice based on offset
  const result: Source[] = []
  for (let i = 0; i < count; i++) {
    result.push(sources[(offset + i) % sources.length])
  }
  return result
}

export const enrichedSignals: Signal[] = [
  {
    id: 1,
    type: "industrial", // Kept original type, as 'market_move' is not in SignalType
    title: "Competitor X launches AI-driven analytics platform",
    description: "Competitor X has announced a new suite of AI tools that directly target our enterprise customer base...",
    date: "2 hours ago",
    time: "2 hrs ago",
    impact: "high",
    sources: generateSources(18),
    fullAnalysis: `
## Executive Summary
**Competitor X's** launch of *"Analytics Pro"* represents a significant threat to our mid-market retention. Features include:

*   **Predictive Churn Modeling**
*   **Automated Reporting**
*   *Direct integration* with major CRMs

This directly targets our **"Insights"** user base, creating an urgent need for differentiation.

## Technical Assessment
The suite appears to be built on top of the new **Llama-3-70b** foundation model, offering lower latency than our current GPT-4 wrapper. 

> Initial benchmarks suggest a **200ms faster response time** for standard queries.

## Market Implications
We expect **aggressive pricing strategies** in Q3 to capture market share. Their press release explicitly mentions *"disrupting legacy pricing models,"* hinting at a **consumption-based billing approach**.
    `,
    metrics: [
      { label: "Est. Revenue Risk", value: "$4.2M", change: "+15%", trend: "negative" },
      { label: "Market Overlap", value: "85%", change: "+5%", trend: "negative" },
      { label: "Feature Parity", value: "92%", change: "-8%", trend: "negative" },
    ],
    relatedSignals: [
      { id: 5, title: "Competitor 'X' Beta leak", date: "2 weeks ago" },
      { id: 2, title: "SaaS Pricing Trends Q3", date: "1 day ago" },
    ],
    tableData: {
      headers: ["Feature", "Our Solution", "Competitor X", "Gap"],
      rows: [
        ["Predictive Churn", "Yes (Basic)", "Yes (Advanced)", "High"],
        ["Auto-Reporting", "Yes", "Yes", "None"],
        ["Custom SQL", "No", "Yes", "Critical"],
        ["API Rate Limit", "1000/min", "5000/min", "High"],
      ]
    },
    chartType: "marketMap",
    marketMapData: {
      xLabel: "Pricing",
      yLabel: "Feature Completeness",
      quadrants: ["Premium Leaders", "Niche Players", "Commodity", "Disruptors"],
      points: [
        { x: 80, y: 85, label: "Us", color: "#2563eb" }, // Blue
        { x: 60, y: 90, label: "Competitor X", color: "#ef4444" }, // Red
        { x: 30, y: 40, label: "Legacy A", color: "#9ca3af" },
        { x: 45, y: 60, label: "Legacy B", color: "#9ca3af" },
        { x: 20, y: 20, label: "Open Source", color: "#10b981" }
      ]
    }
  },
  {
    id: 2,
    type: "pricing",
    title: "SaaS Market Index: median seat price increased by 12%",
    sources: generateSources(15),
    date: "1 day ago",
    time: "Yesterday",
    impact: "medium",
    // Removed 'trend' as it's not in the unified Signal interface
    description: "Across the vertical, B2B SaaS seat prices have seen a steady increase. This suggests an opportunity to adjust our Enterprise tier.",
    fullAnalysis: `
# Market Overview
**Inflationary pressures** and consolidation in the dev-tool space have driven a vertical-wide price increase. 

The median seat price for *Series B+ SaaS companies* has moved from **$25/mo** to **$29/mo**.

## Strategic Opportunity
Our current Enterprise tier is priced at **$22/seat**, significantly *under market value*. 

A **10-15% price increase** would still leave us in the "value" quadrant while boosting ARR by an estimated **$1.5M**.
    `,
    metrics: [
      { label: "Market Median", value: "$29/mo", change: "+12%", trend: "positive" },
      { label: "Our Price", value: "$22/mo", change: "0%", trend: "neutral" },
      { label: "Potential ARR", value: "+$1.5M", change: "N/A", trend: "positive" },
    ],
    relatedSignals: [
      { id: 1, title: "Competitor 'X' launches AI suite", date: "2 hours ago" },
    ],
    chartType: "correlation",
    correlationData: {
      xLabel: "Company Valuation ($M)",
      yLabel: "Seat Price ($)",
      points: [
        { x: 50, y: 20, label: "Startup A", company: "Startup A" },
        { x: 150, y: 25, label: "Scaleup B", company: "Scaleup B" },
        { x: 500, y: 45, label: "Public Corp C", company: "Public Corp C" },
        { x: 300, y: 22, label: "Us", company: "Us" },
        { x: 800, y: 55, label: "Enterprise D", company: "Enterprise D" },
        { x: 120, y: 28, label: "Comp X", company: "Comp X" },
      ]
    },
    tableData: {
      headers: ["Company Stage", "Median Price 2024", "Median Price 2025", "Change"],
      rows: [
        ["Seed", "$15", "$18", "+20%"],
        ["Series A", "$22", "$25", "+13%"],
        ["Series B+", "$25", "$29", "+16%"],
        ["Public", "$45", "$48", "+6%"],
      ]
    }
  },
  {
    id: 3,
    type: "academic",
    title: "New Transformer architecture reduces inference cost by 40%",
    sources: generateSources(12),
    date: "3 days ago",
    time: "Mon 9:00 AM",
    impact: "high",
    // Removed 'trend' as it's not in the unified Signal interface
    description: "A new paper from MIT researchers proposes 'Sparse-Attention-v2' which could significantly reduce our infrastructure costs.",
    fullAnalysis: `
## Research Breakdown
The paper *"Sparse is Enough: Efficient Attention Mechanisms"* demonstrates that by pruning **80% of attention heads** during inference, model accuracy drops by less than 1% while **reducing FLOPs by 40%**.

## Implementation Path
We can fork our current inference engine to implement this sparse attention mask. The engineering effort is estimated at **2 sprints**.
    `,
    metrics: [
      { label: "Infra Savings", value: "$45k/mo", change: "-40%", trend: "positive" },
      { label: "Latency", value: "120ms", change: "-25%", trend: "positive" },
      { label: "Accuracy", value: "98.5%", change: "-0.5%", trend: "neutral" },
    ],
    relatedSignals: [],
    chartType: "revenue",
  },
  {
    id: 4,
    type: "regulation",
    title: "EU AI Act: Compliance deadline approached for High-Risk systems",
    sources: generateSources(20),
    date: "1 week ago",
    time: "Last Week",
    impact: "high",
    // Removed 'trend' as it's not in the unified Signal interface
    description: "The grace period for high-risk AI systems is ending. We need to audit our 'Predictive Scoring' feature.",
    fullAnalysis: `
## Regulatory Alert
**Article 6** of the EU AI Act classifies *"Employment and Worker Management"* algorithms as **High Risk**. 

Our **'Team Performance Scoring'** feature falls under this category.

## Required Actions
1.  **Compile technical documentation** (Annex IV).
2.  **Implement human oversight measures**.
3.  **Register** in the EU Database.
    `,
    metrics: [
      { label: "Compliance Risk", value: "High", change: "Urgent", trend: "negative" },
      { label: "Audit Progress", value: "30%", change: "+5%", trend: "neutral" },
    ],
    relatedSignals: [],
  },
  {
    id: 5,
    type: "competitor",
    title: "Competitor 'X' Beta leak",
    sources: generateSources(8),
    date: "2 weeks ago",
    time: "2 weeks ago",
    impact: "medium",
    // Removed 'trend' as it's not in the unified Signal interface
    description: "Early screenshots of Competitor X's new UI have been leaked, confirming our suspicions about their move upmarket.",
    fullAnalysis: "Leak analysis placeholder.",
    metrics: [],
    relatedSignals: [{ id: 1, title: "Competitor 'X' launches AI suite", date: "2 hours ago" }],
  }
]

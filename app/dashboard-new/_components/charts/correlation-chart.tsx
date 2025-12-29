"use client"

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface CorrelationChartProps {
  data: { x: number; y: number; label: string, company: string }[];
  xLabel: string;
  yLabel: string;
}

export function CorrelationChart({ data, xLabel, yLabel }: CorrelationChartProps) {
  return (
    <div className="h-[300px] w-full relative">
      {/* Axis Labels */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 uppercase tracking-widest">{xLabel}</div>
        <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-500 uppercase tracking-widest origin-center whitespace-nowrap">{yLabel}</div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 30,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            domain={[0, 'auto']}
            tick={{ fontSize: 12, fill: '#888888' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            domain={[0, 'auto']}
            tick={{ fontSize: 12, fill: '#888888' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{data.company}</span>
                    <div className="text-xs text-gray-500">
                      {xLabel}: {data.x} <br />
                      {yLabel}: {data.y}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Companies" data={data} fill="#3b82f6" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

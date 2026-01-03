"use client"

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LabelList, Cell } from "recharts"

interface MarketMapChartProps {
  data: { x: number; y: number; label: string; color?: string }[];
  xLabel: string;
  yLabel: string;
  quadrants: [string, string, string, string]; // TR, TL, BL, BR
}

export function MarketMapChart({ data, xLabel, yLabel, quadrants }: MarketMapChartProps) {
  return (
    <div className="h-[400px] w-full relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Quadrant Labels (Background) */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none p-12">
        <div className="flex-1 flex">
          <div className="flex-1 flex items-start justify-start p-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100/30 dark:bg-gray-800/20">{quadrants[1]}</div>
          <div className="flex-1 flex items-start justify-end p-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-200/30 dark:bg-gray-800/40">{quadrants[0]}</div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 flex items-end justify-start p-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-200/30 dark:bg-gray-800/40">{quadrants[2]}</div>
          <div className="flex-1 flex items-end justify-end p-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100/30 dark:bg-gray-800/20">{quadrants[3]}</div>
        </div>
      </div>

      {/* Axis Labels (Compass Ends) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{yLabel} (High)</div>
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{yLabel} (Low)</div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 rotate-90 origin-center text-[10px] font-bold text-gray-400 uppercase tracking-widest translate-x-1/2">{xLabel} (High)</div>
        <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-bold text-gray-400 uppercase tracking-widest -translate-x-1/2">{xLabel} (Low)</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            domain={[0, 100]}
            hide
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            domain={[0, 100]}
            hide
          />
          {/* Central Axes (Compass Cross) */}
          <ReferenceLine x={50} stroke="#94a3b8" strokeWidth={2} />
          <ReferenceLine y={50} stroke="#94a3b8" strokeWidth={2} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{data.label}</span>
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
          <Scatter name="Market Positioning" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
            ))}
            <LabelList dataKey="label" position="top" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold' }} />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

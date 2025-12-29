"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  {
    date: "Jan 01",
    value: 400,
  },
  {
    date: "Jan 08",
    value: 300,
  },
  {
    date: "Jan 15",
    value: 550,
  },
  {
    date: "Jan 22",
    value: 450,
  },
  {
    date: "Jan 29",
    value: 600,
  },
  {
    date: "Feb 05",
    value: 750,
  },
]

export function RevenueChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${value}`}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-100 bg-white p-2 shadow-md dark:border-gray-800 dark:bg-gray-950">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-gray-500 dark:text-gray-400">
                          Projected
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ${payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#2563eb" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

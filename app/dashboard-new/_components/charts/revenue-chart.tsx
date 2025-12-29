"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"

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
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-white p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-gray-500">
                          Price
                        </span>
                        <span className="font-bold text-gray-900">
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
            stroke="#b45309" // Amber 700 for better visibility than 500 on white
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

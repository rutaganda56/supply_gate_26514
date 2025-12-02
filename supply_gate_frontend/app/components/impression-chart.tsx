"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { name: "1", value: 2 },
  { name: "2", value: 3 },
  { name: "3", value: 2.5 },
  { name: "4", value: 4 },
  { name: "5", value: 3.5 },
  { name: "6", value: 5 },
  { name: "7", value: 4.5 },
  { name: "8", value: 6 },
  { name: "9", value: 7 },
];

export function ImpressionsChart() {
  return (
    <div className="bg-[#1a3a3a] rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg text-white mb-2">Impressions</h3>
      <p className="text-xs text-white/60 mb-4">Impressions Progress</p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ fill: "#4ade80", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-3 h-3 bg-green-400 rounded-full" />
        <span className="text-xs text-white/80">Impressions per period</span>
      </div>
    </div>
  );
}

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
    <div className="bg-gradient-to-br from-[#1a3a3a] to-[#2a4a4a] rounded-lg p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-white mb-1">Impressions</h3>
        <p className="text-xs text-white/70">Impressions Progress</p>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#e5e7eb", fontSize: 11 }}
              label={{ value: "Total Impressions", angle: -90, position: "insideLeft", fill: "#e5e7eb", fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{ fill: "#4ade80", strokeWidth: 2, stroke: "#fff", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm" />
        <span className="text-xs text-white/90 font-medium">Impressions per period</span>
      </div>
    </div>
  );
}

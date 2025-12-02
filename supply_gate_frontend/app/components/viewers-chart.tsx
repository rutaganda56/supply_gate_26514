"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "0", value: 12 },
  { name: "1", value: 14 },
  { name: "2", value: 5 },
  { name: "3", value: 9 },
  { name: "4", value: 6 },
  { name: "5", value: 4 },
  { name: "6", value: 6 },
];

export function ViewersChart() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">
        Viewers For Products
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Bar dataKey="value" fill="#1a3a3a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

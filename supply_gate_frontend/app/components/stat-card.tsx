interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
}

export function StatCard({ title, value, change, changeType }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <p className="text-xs text-muted-foreground mb-1 text-gray-600">
        {title}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            changeType === "positive"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

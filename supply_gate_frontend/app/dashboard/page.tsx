import { Sidebar } from "@/app/components/sidebar";
import { StatCard } from "@/app/components/stat-card";
import { ViewersChart } from "@/app/components/viewers-chart";
import { ImpressionsChart } from "@/app/components/impression-chart";
import { NotificationsTable } from "@/app/components/notifications-table";
import { Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-gray-700" />
            <span className=" text-gray-700">12, July 2025</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Followers"
            value="230"
            change="10%"
            changeType="negative"
          />
          <StatCard
            title="Total Customers"
            value="65"
            change="10%"
            changeType="negative"
          />
          <StatCard
            title="Total Impressions"
            value="130"
            change="10%"
            changeType="positive"
          />
          <StatCard
            title="Total Notifications"
            value="170"
            change="10%"
            changeType="positive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <ViewersChart />
          </div>
          <ImpressionsChart />
        </div>

        {/* Notifications Table */}
        <NotificationsTable />
      </main>
    </div>
  );
}

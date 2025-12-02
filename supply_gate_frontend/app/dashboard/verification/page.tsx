import { Sidebar } from "@/app/components/sidebar";
import { Calendar } from "lucide-react";

export default function verification() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Verification details
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">12, July 2025</span>
          </div>
        </div>
      </main>
    </div>
  );
}

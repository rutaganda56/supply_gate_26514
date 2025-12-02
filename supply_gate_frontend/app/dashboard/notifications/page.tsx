"use client";

import { Sidebar } from "@/app/components/sidebar";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useNotifications } from "@/lib/notifications-context";

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotifications();

  const handleReply = (id: number) => {
    markAsRead(id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">12, July 2025</span>
          </div>
        </div>

        {/* Notification Details Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Details
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Notification Id
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    user name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    message
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    action
                  </th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className={`border-b border-gray-100 ${
                      notification.read ? "opacity-60" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {notification.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {notification.userName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {notification.message}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {notification.date}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        className="bg-[#1e4d5c] hover:bg-[#163a47] text-white text-xs px-3 py-1 h-7"
                        onClick={() => handleReply(notification.id)}
                        disabled={notification.read}
                      >
                        {notification.read ? "replied" : "reply"}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

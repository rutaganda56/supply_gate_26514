"use client";

import { Sidebar } from "@/app/components/sidebar";
import { Calendar, ExternalLink, FileText, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { notificationApi, type NotificationResponseDto } from "@/app/lib/api";
import { TablePagination } from "@/app/components/table-pagination";
import { TableSearch } from "@/app/components/table-search";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useNotifications } from "@/lib/notifications-context";

export default function NotificationsPage() {
  const { refreshNotifications } = useNotifications();
  
  // Notifications state
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [notificationsPage, setNotificationsPage] = useState(0);
  const [notificationsPageSize, setNotificationsPageSize] = useState(20);
  const [notificationsTotalPages, setNotificationsTotalPages] = useState(0);
  const [notificationsTotalElements, setNotificationsTotalElements] = useState(0);
  const [notificationsSearch, setNotificationsSearch] = useState("");
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load notifications
  const loadNotifications = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoadingNotifications(true);
    }
    try {
      const data = await notificationApi.getAll(notificationsPage, notificationsPageSize, notificationsSearch);
      setNotifications(data.content);
      setNotificationsTotalPages(data.totalPages);
      setNotificationsTotalElements(data.totalElements);
      // Also refresh the global notifications context (but don't await to avoid blocking)
      refreshNotifications().catch(() => {
        // Silently fail - context refresh is not critical
      });
    } catch (err: any) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to load notifications:", err);
      }
      // Don't clear notifications on error - keep existing data
      // Only clear if it's an auth error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotifications([]);
      }
    } finally {
      setLoadingNotifications(false);
      setRefreshing(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    await loadNotifications(true);
  };

  // Load data when component mounts or when pagination/search changes
  useEffect(() => {
    loadNotifications();
  }, [notificationsPage, notificationsPageSize, notificationsSearch]);

  // Set up real-time polling for notifications
  useEffect(() => {
    // Poll every 10 seconds for real-time updates (reduced from 15s for better responsiveness)
    // This ensures suppliers see new notifications in near real-time
    const notificationsInterval = setInterval(() => {
      loadNotifications(false);
    }, 10000);

    return () => {
      clearInterval(notificationsInterval);
    };
    // Note: We intentionally don't include dependencies to avoid recreating intervals
    // The intervals will use the latest state via closure
  }, []); // Empty dependency array - intervals are stable

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      // Reload notifications to update read status
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleReply = async (notificationId: string, notificationMessage?: string) => {
    try {
      await markAsRead(notificationId);
      
      let senderEmail = "";
      
      // First, try to extract email from notification message
      // Format: "New message from {senderName} ({senderEmail}): {subject}"
      if (notificationMessage) {
        // Try to extract email from format: "New message from Name (email@example.com): Subject"
        const emailMatch = notificationMessage.match(/\(([^)]+@[^)]+)\)/);
        if (emailMatch && emailMatch[1]) {
          senderEmail = emailMatch[1].trim();
        }
      }
      
      // If not found in message, try to fetch from backend
      if (!senderEmail) {
        try {
          senderEmail = await notificationApi.getSenderEmail(notificationId);
        } catch (err) {
          // If backend can't find it, continue with empty email
          console.warn("Could not fetch sender email from backend:", err);
        }
      }
      
      // Open Gmail compose with the sender email
      if (senderEmail) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(senderEmail)}`;
        window.open(gmailUrl, '_blank');
      } else {
        // Fallback: if we can't extract email, open Gmail compose without recipient
        window.open('https://mail.google.com/mail/?view=cm&fs=1', '_blank');
      }
    } catch (err) {
      console.error("Failed to handle reply:", err);
    }
  };


  const handleViewVerification = async (notificationId: string) => {
    await markAsRead(notificationId);
    // Navigation will be handled by Link
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 h-full">
      <Sidebar />

      <main className="flex-1 p-8 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Notification Details Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              All Notifications
            </h2>
          </div>

          {/* Search */}
          <div className="mb-4">
            <TableSearch
              placeholder="Search notifications by message or type..."
              onSearch={(search) => {
                setNotificationsSearch(search);
                setNotificationsPage(0); // Reset to first page when searching
              }}
              className="max-w-md"
            />
          </div>

          {loadingNotifications ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1e4d5c]" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {notificationsSearch ? "No notifications found matching your search" : "No notifications yet"}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Notification Id
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      User Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Message
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr
                      key={notification.notificationId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        notification.isRead ? "opacity-60" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                        {notification.notificationId.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {notification.userName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {notification.message}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(notification.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {notification.type === "verification_rejection" ? (
                          <Link href="/dashboard/verification">
                            <Button
                              size="sm"
                              className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-xs px-3 py-1 h-7"
                              onClick={() => handleViewVerification(notification.notificationId)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </Link>
                        ) : notification.type === "message" ? (
                          <Button
                            size="sm"
                            className="bg-[#1e4d5c] hover:bg-[#163a47] text-white text-xs px-3 py-1 h-7 flex items-center gap-1"
                            onClick={() => handleReply(notification.notificationId, notification.message)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Reply via Gmail
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-3 py-1 h-7"
                            onClick={() => markAsRead(notification.notificationId)}
                            disabled={notification.isRead}
                          >
                            {notification.isRead ? "Read" : "Mark Read"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={notificationsPage}
                totalPages={notificationsTotalPages}
                totalElements={notificationsTotalElements}
                pageSize={notificationsPageSize}
                onPageChange={setNotificationsPage}
                onPageSizeChange={(size) => {
                  setNotificationsPageSize(size);
                  setNotificationsPage(0);
                }}
                loading={loadingNotifications}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

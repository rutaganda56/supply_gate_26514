"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { notificationApi, type NotificationResponseDto } from "@/app/lib/api";

interface NotificationsContextType {
  notifications: NotificationResponseDto[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Memoize loadNotifications to prevent infinite loops
  const loadNotifications = useCallback(async () => {
    // Check if user is authenticated
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      if (isMountedRef.current) {
        setNotifications([]);
        setLoading(false);
      }
      return;
    }

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }
    
    try {
      // Load first page of notifications for the sidebar count
      // Individual pages will load their own paginated data
      const data = await notificationApi.getAll(0, 50); // Get first 50 for context
      
      if (!isMountedRef.current) return; // Component unmounted, don't update state
      
      // Ensure data has the expected structure
      if (data && Array.isArray(data.content)) {
        setNotifications(data.content);
      } else if (Array.isArray(data)) {
        // Fallback: if API returns array directly instead of paginated response
        setNotifications(data);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Unexpected notification data structure:", data);
        }
        setNotifications([]);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return; // Component unmounted, don't update state
      
      // If unauthorized, user is not logged in - set empty array (this is expected)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setNotifications([]);
        setError(null); // Don't show error for auth issues
        // Don't log this error - it's expected when user is not logged in
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Network error - don't show error, just keep existing notifications
        // Don't clear notifications on network error - keep what we have
        setError(null);
        // Only log network errors in development
        if (process.env.NODE_ENV === 'development') {
          console.warn("Network error loading notifications:", err.message);
        }
      } else {
        // Only log unexpected errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load notifications:", err);
        }
        setError(null); // Don't show error to user
        // Keep existing notifications on error
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []); // Empty dependency array - function is stable

  // Load notifications on mount
  useEffect(() => {
    isMountedRef.current = true;
    loadNotifications();
    
    // Set up polling to refresh notifications every 10 seconds for real-time updates
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        loadNotifications();
      }
    }, 10000); // Poll every 10 seconds for better real-time responsiveness

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadNotifications]);

  // Listen for storage changes (when user logs in/out)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && isMountedRef.current) {
        loadNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadNotifications]);

  // Calculate unread count from notifications (includes both notifications and messages)
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      throw err;
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
}

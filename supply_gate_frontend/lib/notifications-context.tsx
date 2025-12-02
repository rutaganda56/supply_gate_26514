"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface Notification {
  id: number;
  userName: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    userName: "ruta",
    message: "message 1",
    date: "04/7/2025",
    read: false,
  },
  {
    id: 2,
    userName: "peace",
    message: "message 2",
    date: "11/7/2025",
    read: false,
  },
  {
    id: 3,
    userName: "colombe",
    message: "message 3",
    date: "12/7/2025",
    read: false,
  },
  {
    id: 4,
    userName: "vaillante",
    message: "message 4",
    date: "18/7/2025",
    read: false,
  },
];

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
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

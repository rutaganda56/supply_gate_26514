"use client";

import type React from "react";

import { NotificationsProvider } from "@/lib/notifications-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}

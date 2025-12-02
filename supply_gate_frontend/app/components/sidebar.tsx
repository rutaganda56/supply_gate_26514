"use client";

import {
  LayoutDashboard,
  Store,
  Bell,
  CheckSquare,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/notifications-context";
import { Button } from "./ui/button";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Store, label: "Store", href: "/dashboard/store" },
  {
    icon: Bell,
    label: "Notifications",
    href: "/dashboard/notifications",
    hasBadge: true,
  },
  { icon: CheckSquare, label: "Verification", href: "/dashboard/verification" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <aside
      className={cn(
        "flex flex-col h-194vh  w-64 bg-[#1a3a3a] text-white",
        className
      )}
    >
      {/* User Profile */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <img
          src="/professional-man-avatar.png"
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Rutaganda</h3>
          <p className="text-xs text-white/80">jean valentin</p>
          <span className="text-xs text-white/60">Supplier</span>
        </div>
        <Button className="p-1 hover:bg-white/10 rounded">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ",
                    isActive ? "bg-white text-green-900" : "hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.hasBadge && unreadCount > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                      {unreadCount.toString().padStart(2, "0")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/5 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <Link href={"/login"}>Logout</Link>
        </Button>
      </div>
    </aside>
  );
}

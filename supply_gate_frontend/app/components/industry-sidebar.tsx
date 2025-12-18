"use client";

import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface IndustrySidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/industryDashBoard" },
  { icon: CheckSquare, label: "Verification", href: "/industryDashBoard/verification" },
  { icon: Settings, label: "Settings", href: "/industryDashBoard/settings" },
];

export function IndustrySidebar({ className }: IndustrySidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Initialize with false to prevent hydration mismatch
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePicture: "/professional-man-avatar.png",
    fullName: "Industry Worker",
    username: "Worker User",
  });

  // Load sidebar state from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("industrySidebarCollapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isCollapsed]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("industryProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData({
        profilePicture: parsed.profilePicture || "/professional-man-avatar.png",
        fullName: parsed.fullName?.split(" ")[0] || "Industry",
        username: parsed.fullName?.split(" ").slice(1).join(" ") || parsed.username || "Worker",
      });
    }
  }, []);
  
  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem("industryProfile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          profilePicture: parsed.profilePicture || "/professional-man-avatar.png",
          fullName: parsed.fullName?.split(" ")[0] || "Industry",
          username: parsed.fullName?.split(" ").slice(1).join(" ") || parsed.username || "Worker",
        });
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("industrySidebarCollapsed", String(newState));
  };

  const handleLogout = () => {
    // Clear any local storage or session data if needed
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "flex flex-col bg-[#1a3a3a] text-white transition-all duration-300 ease-in-out relative shrink-0",
          isMobile 
            ? (isCollapsed ? "w-0 overflow-hidden h-screen" : "w-64 fixed z-50 shadow-2xl h-screen")
            : (isCollapsed ? "w-20 self-stretch" : "w-auto min-w-[256px] max-w-[320px] self-stretch"),
          className
        )}
        style={mounted && !isMobile && !isCollapsed ? {
          width: `${Math.max(256, Math.min(320, 200 + Math.max(...navItems.map(item => item.label.length)) * 7))}px`
        } : undefined}
      >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 bg-[#1a3a3a] border-2 border-white/20 rounded-full p-1.5 hover:bg-[#2a4a4a] transition-colors shadow-lg"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      {/* User Profile */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-white/10 transition-all duration-300",
        isCollapsed && "justify-center px-2"
      )}>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{profileData.fullName}</h3>
            <p className="text-xs text-white/80 truncate">{profileData.username}</p>
            <span className="text-xs text-white/60">Industry</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className={cn("space-y-1 transition-all duration-300", isCollapsed ? "px-2" : "px-3")}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group",
                    isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
                    isActive 
                      ? "bg-white text-green-900 shadow-sm" 
                      : "hover:bg-white/10 text-white"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "flex-shrink-0 transition-transform",
                    isCollapsed ? "w-5 h-5" : "w-5 h-5",
                    isActive && "scale-110"
                  )} />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className={cn(
        "p-4 border-t border-white/10 transition-all duration-300",
        isCollapsed && "px-2"
      )}>
        <Button 
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full hover:bg-white/10 rounded-lg transition-all duration-200 bg-transparent text-white hover:text-white border-none",
            isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
    </>
  );
}


"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, Settings, Sparkles, User } from "lucide-react";
import { assetPath } from "@/lib/paths";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  { id: "workspace" as const, label: "Workspace" },
  { id: "myWebsites" as const, label: "My Websites" },
  { id: "templates" as const, label: "Templates" },
  { id: "domains" as const, label: "Domains" },
  { id: "billing" as const, label: "Billing" },
];
type NavId = (typeof NAV_ITEMS)[number]["id"];

const dashboardHeaderQuickIconBtn =
  "flex items-center justify-center rounded-full border border-transparent bg-white p-0 m-0 cursor-pointer shadow-sm transition-all duration-150 ease-out hover:border-white/50 hover:bg-slate-100 hover:shadow-md hover:shadow-black/20 hover:ring-2 hover:ring-white/60 active:scale-[0.96] active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06224C]";

function DashboardHeaderBellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardHeaderSettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden shapeRendering="geometricPrecision">
      <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19 12a7.1 7.1 0 0 0-.07-.95l2.02-1.57-2-3.46-2.48.81a7.5 7.5 0 0 0-1.65-.96L14.4 3h-4.8l-.42 2.87c-.59.23-1.14.55-1.65.96l-2.48-.81-2 3.46 2.02 1.57a7.9 7.9 0 0 0 0 1.9L3.05 14.52l2 3.46 2.48-.81c.5.41 1.06.73 1.65.96L9.6 21h4.8l.42-2.87c.59-.23 1.14-.55 1.65-.96l2.48.81 2-3.46-2.02-1.57c.05-.31.07-.63.07-.95Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
    </svg>
  );
}

export default function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeNav, setActiveNav] = useState<NavId>("workspace");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileWrapRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleNavClick(id: NavId) {
    setActiveNav(id);
    setMobileMenuOpen(false);
    if (id === "workspace" || id === "myWebsites") {
      router.push("/dashboard");
      return;
    }
    if (id === "templates") {
      router.push("/landing#templates");
      return;
    }
    window.setTimeout(() => {
      router.push("/page-not-found");
    }, 120);
  }

  const displayName = user?.name || "Stackly User";
  const displayEmail = user?.email || "user@stackly.com";
  const displayAvatar = user?.avatar || "";

  function handleSignOut() {
    logout();
    setProfileOpen(false);
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#06224C]">
      <div className="flex w-full flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 xl:flex-nowrap">
        <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/25 text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/landing" className="flex h-8 min-w-[92px] items-center justify-center overflow-hidden rounded-[50%] bg-white px-3 sm:h-9 sm:min-w-[104px]">
            <img src={assetPath("/stackly-logo.webp")} alt="Stackly logo" className="h-[18px] w-auto sm:h-[20px]" />
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 lg:flex lg:items-center">
          <nav className="flex w-full min-w-0 flex-wrap items-center justify-evenly gap-x-2 gap-y-2 text-[13px] text-white sm:text-sm sm:gap-x-3" aria-label="Main">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`shrink-0 rounded-md border-b-2 px-2 py-1 transition-colors ${
                  activeNav === item.id
                    ? "border-[#f0e6d4] bg-white/10 font-medium text-white"
                    : "border-transparent hover:bg-white/10 hover:text-white"
                }`}
                aria-current={activeNav === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex min-w-0 flex-nowrap items-center gap-4 sm:gap-5 lg:gap-6">
          <div className="flex shrink-0 items-center gap-3 lg:hidden">
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-8 w-8 touch-manipulation`} aria-label="Analytics" onClick={() => router.push("/dashboard/analytics")}>
              <BarChart3 className="pointer-events-none h-[17px] w-[17px] shrink-0 text-[#06224C]" />
            </button>
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-8 w-8 touch-manipulation`} aria-label="Settings">
              <DashboardHeaderSettingsIcon className="pointer-events-none h-[17px] w-[17px] shrink-0 text-[#06224C]" />
            </button>
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-8 w-8 touch-manipulation`} aria-label="Notifications">
              <DashboardHeaderBellIcon className="pointer-events-none h-[18px] w-[18px] shrink-0 text-[#06224C]" />
            </button>
          </div>

          <div className="hidden items-center gap-5 lg:flex lg:gap-6">
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-6 w-6`} aria-label="Analytics" onClick={() => router.push("/dashboard/analytics")}>
              <BarChart3 className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
            </button>
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-6 w-6`} aria-label="Settings">
              <DashboardHeaderSettingsIcon className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
            </button>
            <button type="button" className={`${dashboardHeaderQuickIconBtn} h-6 w-6`} aria-label="Notifications">
              <DashboardHeaderBellIcon className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
            </button>
          </div>

          <div className="relative shrink-0" ref={profileWrapRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((o) => !o);
              }}
              className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 transition-colors duration-150 ease-out hover:bg-white/15 active:bg-white/25 md:rounded-lg md:px-2 md:py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06224C]"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label={`Profile menu, ${displayName}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-2 ring-white/50 md:h-7 md:w-7">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <span className="hidden max-w-[140px] truncate text-left text-[11px] text-white md:inline md:max-w-[180px]">
                {displayName}
              </span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={`hidden shrink-0 text-white/90 transition-transform md:block ${profileOpen ? "rotate-180" : ""}`}>
                <path d="M3.5 5L6 7.5L8.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[222px] overflow-hidden rounded-2xl border border-[#d5dbe3] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]" role="menu">
                <div className="border-b border-[#e6ebf2] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {displayAvatar ? (
                        <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold leading-tight text-[#243b5f]">{displayName}</p>
                      <p className="mt-0.5 truncate text-xs font-semibold text-[#9aa9bc]">{displayEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#3e5373] transition-colors hover:bg-[#f8fafc]" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/analytics" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#3e5373] transition-colors hover:bg-[#f8fafc]" role="menuitem" onClick={() => setProfileOpen(false)}>
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                  <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#3e5373] transition-colors hover:bg-[#f8fafc]" role="menuitem">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#3e5373] transition-colors hover:bg-[#f8fafc]" role="menuitem">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button type="button" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#3e5373] transition-colors hover:bg-[#f8fafc]" role="menuitem">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </button>
                </div>

                <div className="border-t border-[#e6ebf2] py-1.5">
                  <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-semibold text-[#ef4444] transition-colors hover:bg-[#fff5f5]" role="menuitem">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/20 px-3 pb-3 pt-2 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`rounded-md border px-2 py-2 text-left text-xs ${
                  activeNav === item.id
                    ? "border-[#f0e6d4] bg-white/10 text-white"
                    : "border-white/25 text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

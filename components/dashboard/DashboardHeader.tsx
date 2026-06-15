"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { fadeUp, scaleIn } from "@/lib/motion";
import { assetPath } from "@/lib/paths";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function DashboardHeader({ searchQuery, onSearchChange }: DashboardHeaderProps) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-8"
    >
      {/* Logo + Title */}
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
        <img
          src={assetPath("/stackly-logo.webp")}
          alt="Stackly"
          className="h-7 w-auto"
        />
        <span className="hidden text-sm font-extrabold uppercase tracking-[0.12em] text-[#06224C] sm:block">
          Dashboard
        </span>
      </Link>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-sm font-medium text-[#06224C] outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
          <Link
            href="/dashboard/analytics"
            className="block rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#06224C]"
            title="Analytics"
          >
            <BarChart3 className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#06224C]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <motion.span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500"
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>

        {/* Avatar Dropdown */}
        <div ref={dropdownRef} className="relative">
          <motion.button
            onClick={() => setAvatarOpen(!avatarOpen)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pl-2 transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <span className="hidden text-xs font-bold text-[#06224C] sm:block">Stackly User</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-black text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${avatarOpen ? "rotate-180" : ""}`} />
          </motion.button>

          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-bold text-[#06224C]">Stackly User</p>
                  <p className="text-xs text-slate-400">user@stackly.com</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#06224C]"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#06224C]"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#06224C]">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#06224C]">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#06224C]">
                    <HelpCircle className="h-4 w-4" />
                    Help
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

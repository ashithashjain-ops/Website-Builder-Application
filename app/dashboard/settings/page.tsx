"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useProjectStore } from "@/store/projectStore";
import { trackPageView } from "@/lib/analytics";
import ProjectSettingsForm from "@/components/dashboard/ProjectSettingsForm";
import ProfileSettingsPanel from "@/components/dashboard/ProfileSettingsPanel";
import SubscriptionPanel from "@/components/dashboard/SubscriptionPanel";
import Link from "next/link";
import { assetPath } from "@/lib/paths";
import { ArrowLeft, BarChart3, CreditCard, FolderOpen, Home, LayoutDashboard, LifeBuoy, Palette, PlusCircle, Settings2, Sparkles } from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Back to projects",
    icon: LayoutDashboard,
    className: "from-blue-600 to-cyan-500",
  },
  {
    href: "/dashboard/analytics",
    title: "Analytics",
    description: "View traffic insights",
    icon: BarChart3,
    className: "from-violet-600 to-fuchsia-500",
  },
  {
    href: "/landing#templates",
    title: "Templates",
    description: "Browse starters",
    icon: Sparkles,
    className: "from-amber-500 to-orange-500",
  },
  {
    href: "/planning",
    title: "Plans",
    description: "Manage upgrades",
    icon: CreditCard,
    className: "from-emerald-600 to-teal-500",
  },
  {
    href: "/builder",
    title: "Builder",
    description: "Open editor",
    icon: PlusCircle,
    className: "from-slate-900 to-blue-700",
  },
  {
    href: "/landing#contact",
    title: "Support",
    description: "Contact Stackly",
    icon: LifeBuoy,
    className: "from-rose-500 to-pink-500",
  },
];

function SettingsQuickLinks() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-blue-700">Quick Navigation</p>
          <h2 className="mt-1 text-xl font-black text-[#06224C]">Jump to another workspace area</h2>
        </div>
        <p className="text-xs font-semibold text-slate-400">Shortcuts stay one click away.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045, duration: 0.28, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <Link
                href={item.href}
                className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-950/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.className} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-[#06224C] transition-colors group-hover:text-blue-700">{item.title}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-400">{item.description}</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get("id") ?? "";
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadProjects();
    if (projectId) trackPageView(`/project/${projectId}/settings`);
    setMounted(true);
  }, [loadProjects, projectId]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
      </div>
    );
  }

  if (!projectId) {
    return (
      <main className="dashboard-page min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.14),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_45%,#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 md:px-8">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-[#06224C] via-blue-700 to-cyan-500 p-6 text-white shadow-[0_28px_80px_rgba(6,34,76,0.22)] sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100">Dashboard Settings</p>
                <h1 className="mt-2 flex items-center gap-3 text-3xl font-black sm:text-4xl">
                  <Palette className="h-8 w-8 text-cyan-200" />
                  Tune your account
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/78">
                  Update profile details, upload a local avatar, and manage the subscription state reflected across Stackly.
                </p>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/25"
              >
                <Settings2 className="h-8 w-8 text-white" />
              </motion.div>
            </div>
          </motion.section>

          <SettingsQuickLinks />
          <ProfileSettingsPanel />
          <SubscriptionPanel />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex min-h-[32vh] flex-col items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur"
          >
            <FolderOpen className="h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-[#06224C]">No Project Selected</h2>
            <p className="mt-2 text-sm text-slate-400">Select a project to edit project-specific settings.</p>
            <Link href="/dashboard" className="mt-6 rounded-xl bg-[#06224C] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-900">
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.14),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_45%,#fff7ed_100%)]">
      {/* Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-40 border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur-xl sm:px-6 md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img src={assetPath("/stackly-logo.webp")} alt="Stackly" className="h-7 w-auto" />
            </Link>
            <span className="hidden text-sm font-extrabold uppercase tracking-[0.12em] text-[#06224C] sm:block">
              Project Settings
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#06224C]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
      </motion.header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 md:px-8">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r from-[#06224C] via-blue-700 to-cyan-500 p-6 text-white shadow-[0_28px_80px_rgba(6,34,76,0.22)] sm:p-8"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100">Project Settings</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Shape this workspace</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/78">
            Keep account, subscription, and project preferences aligned in one place.
          </p>
        </motion.section>
        <SettingsQuickLinks />
        <ProfileSettingsPanel />
        <SubscriptionPanel />
        <ProjectSettingsForm projectId={projectId} />
      </div>
    </main>
  );
}

/**
 * Project Settings page — uses query param ?id=xxx.
 * Wrapped in Suspense because useSearchParams requires it during static export.
 */
export default function ProjectSettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="dashboard-page min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
          </div>
        </main>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

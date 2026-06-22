"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { WeeklyTraffic } from "@/types/analytics";

interface VisitorsChartProps {
  data: WeeklyTraffic[];
}

export default function VisitorsChart({ data }: VisitorsChartProps) {
  const maxValue = Math.max(1, ...data.flatMap((item) => [item.visitors, item.views]));
  const chartHeight = 180;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#06224C]">
        Weekly Visitors
      </h3>
      <div className="h-64 w-full sm:h-72">
        <div className="flex h-full items-end gap-3 border-b border-slate-100 px-1 pb-8 pt-4">
          {data.map((item) => (
            <div key={item.week} className="relative flex min-w-0 flex-1 items-end justify-center gap-1">
              <div
                className="w-full max-w-5 rounded-t-md bg-gradient-to-b from-blue-500 to-indigo-500"
                style={{ height: `${Math.max(6, (item.visitors / maxValue) * chartHeight)}px` }}
                title={`${item.week}: ${item.visitors} visitors`}
              />
              <div
                className="w-full max-w-5 rounded-t-md bg-slate-200"
                style={{ height: `${Math.max(6, (item.views / maxValue) * chartHeight)}px` }}
                title={`${item.week}: ${item.views} views`}
              />
              <span className="absolute -bottom-6 truncate text-[10px] font-semibold text-slate-400">
                {item.week}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
          <span className="text-xs font-semibold text-slate-500">Visitors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="text-xs font-semibold text-slate-500">Views</span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import type { DailyTraffic } from "@/types/analytics";

interface ViewsChartProps {
  data: DailyTraffic[];
  title?: string;
}

export default function ViewsChart({ data, title = "Traffic Overview" }: ViewsChartProps) {
  const width = 640;
  const height = 220;
  const padding = 28;
  const maxValue = Math.max(1, ...data.flatMap((item) => [item.views, item.visitors]));
  const xFor = (index: number) =>
    padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
  const yFor = (value: number) =>
    height - padding - (value / maxValue) * (height - padding * 2);
  const toPoints = (key: "views" | "visitors") =>
    data.map((item, index) => `${xFor(index)},${yFor(item[key])}`).join(" ");
  const areaPath = (key: "views" | "visitors") => {
    const points = data.map((item, index) => [xFor(index), yFor(item[key])] as const);
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `M ${first[0]} ${height - padding} L ${points
      .map(([x, y]) => `${x} ${y}`)
      .join(" L ")} L ${last[0]} ${height - padding} Z`;
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#06224C]">
        {title}
      </h3>
      <div className="h-64 w-full sm:h-72">
        <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => {
            const y = padding + line * ((height - padding * 2) / 3);
            return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#f1f5f9" />;
          })}
          <path d={areaPath("views")} fill="url(#viewsGradient)" />
          <path d={areaPath("visitors")} fill="url(#visitorsGradient)" />
          <polyline points={toPoints("views")} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={toPoints("visitors")} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((item, index) => (
            <text key={item.date} x={xFor(index)} y={height - 6} textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">
              {item.date}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-slate-500">Page Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          <span className="text-xs font-semibold text-slate-500">Visitors</span>
        </div>
      </div>
    </motion.div>
  );
}

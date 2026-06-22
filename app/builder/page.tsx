"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/ProtectedRoute";

const BuilderLayout = dynamic(() => import("@/components/builder/BuilderLayout"), {
  ssr: false,
});

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderLayout />
    </ProtectedRoute>
  );
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useBuilderStore } from "@/store/builderStore";
import { saveWorkspaceState, loadWorkspaceState } from "@/lib/api";
import type { BuilderComponent } from "@/types/builder";

/**
 * Hook that wires builder store to backend persistence.
 *
 * - On mount: loads workspace state from API and pushes into builder store
 * - On component changes: debounced auto-save to API
 */
export function useBuilder(workspaceId?: string | null) {
  const builder = useBuilderStore();
  const { components, loadComponents } = builder;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSnapshotRef = useRef<string>("");
  const loadedWorkspaceRef = useRef<string | null>(null);

  // ── Load workspace state on mount ──
  useEffect(() => {
    if (!workspaceId || loadedWorkspaceRef.current === workspaceId) return;

    loadedWorkspaceRef.current = null;
    prevSnapshotRef.current = "";

    (async () => {
      try {
        const resp = await loadWorkspaceState(workspaceId);
        const saved = resp.state.builderData?.components;
        if (saved && Array.isArray(saved) && saved.length > 0) {
          loadComponents(saved as BuilderComponent[]);
          prevSnapshotRef.current = JSON.stringify(saved);
        }
        loadedWorkspaceRef.current = workspaceId;
      } catch {
        // Workspace state may not exist yet — that's fine
        loadedWorkspaceRef.current = workspaceId;
      }
    })();
  }, [workspaceId, loadComponents]);

  // ── Debounced auto-save when components change ──
  const save = useCallback(() => {
    if (!workspaceId) return;

    const snapshot = JSON.stringify(components);
    if (snapshot === prevSnapshotRef.current) return;
    prevSnapshotRef.current = snapshot;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveWorkspaceState(workspaceId, {
          pageData: {},
          builderData: { components },
        });
      } catch {
        // Silent fail — user can manually save
      }
    }, 2000); // 2s debounce
  }, [workspaceId, components]);

  useEffect(() => {
    if (workspaceId && loadedWorkspaceRef.current === workspaceId) {
      save();
    }
  }, [save, workspaceId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return builder;
}

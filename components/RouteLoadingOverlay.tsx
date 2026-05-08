"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import StacklyLoader from "./StacklyLoader";

const MIN_VISIBLE_MS = 420;
const MAX_VISIBLE_MS = 3500;

function isModifiedClick(event: globalThis.MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const startedAt = useRef(0);
  const hideTimer = useRef<number | null>(null);
  const maxTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    if (maxTimer.current) {
      window.clearTimeout(maxTimer.current);
      maxTimer.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimers();
    startedAt.current = Date.now();
    setVisible(true);
    maxTimer.current = window.setTimeout(() => setVisible(false), MAX_VISIBLE_MS);
  }, [clearTimers]);

  useEffect(() => {
    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest("a") : null;

      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      const href = target.getAttribute("href");

      if (!href || href.startsWith("#") || target.target === "_blank" || target.hasAttribute("download")) {
        return;
      }

      const nextUrl = new URL(target.href, window.location.href);
      const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
      const nextPath = nextUrl.pathname.replace(/\/+$/, "") || "/";

      if (nextUrl.origin !== window.location.origin || nextPath === currentPath) {
        return;
      }

      show();
    };

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("beforeunload", show);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("beforeunload", show);
      clearTimers();
    };
  }, [clearTimers, show]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const elapsed = Date.now() - startedAt.current;
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);

    hideTimer.current = window.setTimeout(() => {
      setVisible(false);
      clearTimers();
    }, delay);
  }, [clearTimers, pathname, visible]);

  if (!visible) {
    return null;
  }

  return <StacklyLoader label="Preparing page" />;
}

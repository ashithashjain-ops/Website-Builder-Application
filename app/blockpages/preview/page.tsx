"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { bindPortfolioProjectsSliderNavDelegation } from "@/lib/portfolioProjectsSlider";

const TEXTBLOCK_PREVIEW_STORAGE_KEY = "stackly-textblock-preview-html";

export default function BlockPreviewPage() {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  useEffect(() => bindPortfolioProjectsSliderNavDelegation(), []);

  useEffect(() => {
    const loadPreview = () => {
      setPreviewHtml(window.localStorage.getItem(TEXTBLOCK_PREVIEW_STORAGE_KEY) ?? "");
    };

    const frameId = window.requestAnimationFrame(() => {
      loadPreview();
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === TEXTBLOCK_PREVIEW_STORAGE_KEY) {
        setPreviewHtml(event.newValue ?? "");
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!previewHtml) return;

    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");

              if (entry.target.classList.contains("skill-progress-bar")) {
                const targetWidth = (entry.target as HTMLElement).dataset.targetWidth;
                if (targetWidth) {
                  (entry.target as HTMLElement).style.width = targetWidth;
                }
              }

              if (entry.target.classList.contains("stat-animate-count")) {
                const el = entry.target as HTMLElement;
                const target = parseInt(el.dataset.target || "0", 10);
                const suffix = el.dataset.suffix || "";
                const duration = 2000;
                const start = performance.now();
                const step = (now: number) => {
                  const progress = Math.min((now - start) / duration, 1);
                  el.textContent = Math.round(progress * target).toString();
                  if (progress < 1) requestAnimationFrame(step);
                  else el.textContent = target.toString() + suffix;
                };
                requestAnimationFrame(step);
              }

              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll(".portfolio-reveal").forEach((el) => {
        el.classList.remove("is-visible");
        observer.observe(el);
      });

      document.querySelectorAll(".skill-progress-bar").forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.width = "0%";
        // Force a reflow so the transition from 0% is registered
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        htmlEl.offsetHeight;
        observer.observe(el);
      });

      document.querySelectorAll(".stat-animate-count").forEach((el) => {
        el.textContent = "0";
        observer.observe(el);
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [previewHtml]);

  if (previewHtml === null) {
    return <main className="min-h-screen bg-[#f5f7fb]" />;
  }

  if (!previewHtml) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7fb] px-4 text-center text-[#0B1D40]">
        <h1 className="text-2xl font-black">No preview available</h1>
        <p className="mt-3 max-w-md text-sm text-slate-500">Open the editor, make your changes, and click Preview again.</p>
        <Link href="/blockpages" className="mt-6 rounded-md bg-[#0B1D40] px-5 py-2.5 text-sm font-bold text-white">
          Back to editor
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#f5f7fb]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      <Footer />
    </>
  );
}

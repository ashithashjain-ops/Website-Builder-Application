const BASE_FONT_PX = 14;
const MIN_FONT_PX = 8;
const FONT_STEP_PX = 0.5;

/** Shrink input font only when placeholder text would overflow the field width. */
export function fitInputPlaceholderToWidth(input: HTMLInputElement | null): void {
  if (!input || typeof window === "undefined") return;

  const text = input.getAttribute("placeholder") ?? "";
  if (!text) return;

  const available = input.clientWidth;
  if (available <= 0) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const style = getComputedStyle(input);
  const fontFamily = style.fontFamily || "sans-serif";
  const fontWeight = style.fontWeight || "400";

  let chosen = BASE_FONT_PX;
  for (let size = BASE_FONT_PX; size >= MIN_FONT_PX; size -= FONT_STEP_PX) {
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    const width = ctx.measureText(text).width;
    if (width <= available - 2) {
      chosen = size;
      break;
    }
  }

  input.style.setProperty("font-size", `${chosen}px`);
}

export function clearInputPlaceholderFit(input: HTMLInputElement | null): void {
  input?.style.removeProperty("font-size");
}

/** Re-fit on resize / zoom; only active when `enabled` is true (mobile auth). */
export function observeAuthPlaceholderFit(
  input: HTMLInputElement | null,
  enabled: boolean
): () => void {
  if (!input || !enabled) {
    clearInputPlaceholderFit(input);
    return () => undefined;
  }

  const run = () => {
    if (document.activeElement === input) return;
    fitInputPlaceholderToWidth(input);
  };

  run();
  if (document.fonts?.ready) {
    void document.fonts.ready.then(() => requestAnimationFrame(run));
  }

  const ro = new ResizeObserver(() => {
    requestAnimationFrame(run);
  });
  ro.observe(input);
  const row = input.closest(".login-contact-row, .signup-phone-row");
  if (row) ro.observe(row);

  const onViewportChange = () => requestAnimationFrame(run);
  window.addEventListener("resize", onViewportChange);
  window.visualViewport?.addEventListener("resize", onViewportChange);
  window.visualViewport?.addEventListener("scroll", onViewportChange);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", onViewportChange);
    window.visualViewport?.removeEventListener("resize", onViewportChange);
    window.visualViewport?.removeEventListener("scroll", onViewportChange);
    clearInputPlaceholderFit(input);
  };
}

export function isMobileAuthViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1023px)").matches;
}

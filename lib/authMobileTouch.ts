/** True when the page is pinch-zoomed (visual viewport scale > 1). */
export function isAuthPageZoomed(): boolean {
  if (typeof window === "undefined") return false;
  return (window.visualViewport?.scale ?? 1) > 1.01;
}

/** Android WebView / Chrome — needs document scroll for post-zoom pan. */
export function isAndroidMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

/** Apply `auth-android` on <html> for Android-specific auth CSS. */
export function mountAuthAndroidClass(): () => void {
  if (typeof document === "undefined") return () => undefined;
  if (!isAndroidMobile()) return () => undefined;
  document.documentElement.classList.add("auth-android");
  return () => document.documentElement.classList.remove("auth-android");
}

/** Scroll root for pull-to-refresh: document on Android, inner panel on iOS. */
export function getAuthPullScrollRoot(loginPage: boolean): HTMLElement | null {
  if (typeof window === "undefined" || window.innerWidth >= 1024) return null;
  if (isAndroidMobile()) {
    return document.scrollingElement as HTMLElement | null;
  }
  if (loginPage) {
    return document.querySelector(".login-page .login-card-inner") as HTMLElement | null;
  }
  return document.querySelector(".auth-page") as HTMLElement | null;
}

/** 150%–200%+ pinch-zoom on mobile signup: stack mobile number under country selector. */
const SIGNUP_PHONE_STACK_ZOOM = 1.5;

/** Pinch / page zoom factor (iOS reports scale; Android often only shrinks the visual viewport). */
function getAuthVisualZoomScale(): number {
  const vv = window.visualViewport;
  if (!vv) return 1;

  const reported = vv.scale > 0 ? vv.scale : 1;
  const layoutWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const widthRatio =
    vv.width > 0 && layoutWidth > 0 ? layoutWidth / vv.width : 1;

  return Math.max(reported, widthRatio);
}

let signupPhoneBaselineInner = 0;
let signupPhoneBaselineVisual = 0;

function captureSignupPhoneZoomBaseline(): void {
  const vv = window.visualViewport;
  const scale = getAuthVisualZoomScale();
  if (scale > 1.08) return;
  if (window.innerWidth > 0) signupPhoneBaselineInner = window.innerWidth;
  if (vv && vv.width > 0) signupPhoneBaselineVisual = vv.width;
}

function getSignupPhoneZoomScale(): number {
  const vv = window.visualViewport;
  const fromViewport = getAuthVisualZoomScale();

  const layoutShrink =
    signupPhoneBaselineInner > 0 && window.innerWidth > 0
      ? signupPhoneBaselineInner / window.innerWidth
      : 1;
  const visualShrink =
    signupPhoneBaselineVisual > 0 && vv && vv.width > 0
      ? signupPhoneBaselineVisual / vv.width
      : 1;

  return Math.max(fromViewport, layoutShrink, visualShrink);
}

/** Android: stack when country + mobile no longer fit one row (scale APIs often stay at 1). */
function signupPhoneRowOverflows(): boolean {
  if (!isAndroidMobile()) return false;
  const fields = document.querySelector(
    ".signup-card-content .signup-phone-fields"
  );
  if (!fields) return false;
  const country = fields.querySelector(".signup-country-select");
  const mobile = fields.querySelector(".signup-mobile-input");
  if (!country || !mobile) return false;
  const gap = 8;
  const needed =
    country.getBoundingClientRect().width +
    gap +
    mobile.getBoundingClientRect().width;
  return needed > fields.getBoundingClientRect().width + 2;
}

function shouldStackSignupPhone(mobile: boolean): boolean {
  if (!mobile) return false;
  const threshold = isAndroidMobile() ? 1.48 : SIGNUP_PHONE_STACK_ZOOM;
  if (getSignupPhoneZoomScale() >= threshold) return true;
  return signupPhoneRowOverflows();
}

export function mountSignupPhoneStackedClass(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const mql = window.matchMedia("(max-width: 1023px)");
  let rowObserver: ResizeObserver | null = null;

  const update = () => {
    if (mql.matches) captureSignupPhoneZoomBaseline();
    const stacked = shouldStackSignupPhone(mql.matches);
    document.documentElement.classList.toggle(
      "signup-phone-zoom-stacked",
      stacked
    );

    const fields = document.querySelector(
      ".signup-card-content .signup-phone-fields"
    );
    if (fields && !rowObserver) {
      rowObserver = new ResizeObserver(() => update());
      rowObserver.observe(fields);
      const row = fields.closest(".signup-phone-row");
      if (row) rowObserver.observe(row);
    }
  };

  captureSignupPhoneZoomBaseline();
  update();

  mql.addEventListener("change", update);
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
  document.addEventListener("touchend", update, { passive: true });
  document.addEventListener("touchcancel", update, { passive: true });

  return () => {
    mql.removeEventListener("change", update);
    window.visualViewport?.removeEventListener("resize", update);
    window.visualViewport?.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    window.removeEventListener("orientationchange", update);
    document.removeEventListener("touchend", update);
    document.removeEventListener("touchcancel", update);
    rowObserver?.disconnect();
    rowObserver = null;
    signupPhoneBaselineInner = 0;
    signupPhoneBaselineVisual = 0;
    document.documentElement.classList.remove("signup-phone-zoom-stacked");
  };
}

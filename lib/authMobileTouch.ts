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

/** ~200% pinch-zoom on mobile signup: stack mobile number under country selector. */
const SIGNUP_PHONE_STACK_ZOOM = 1.85;

export function mountSignupPhoneStackedClass(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const mql = window.matchMedia("(max-width: 1023px)");
  const update = () => {
    const scale = window.visualViewport?.scale ?? 1;
    document.documentElement.classList.toggle(
      "signup-phone-zoom-stacked",
      mql.matches && scale >= SIGNUP_PHONE_STACK_ZOOM
    );
  };

  update();
  mql.addEventListener("change", update);
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  return () => {
    mql.removeEventListener("change", update);
    window.visualViewport?.removeEventListener("resize", update);
    window.visualViewport?.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
    document.documentElement.classList.remove("signup-phone-zoom-stacked");
  };
}

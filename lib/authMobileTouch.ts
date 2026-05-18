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

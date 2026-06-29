"use client";

import { useEffect } from "react";

/** Languages offered (must match the labels in lib/content LANGUAGES). */
export const LANGUAGE_CODES: Record<string, string> = {
  English: "en",
  "हिन्दी": "hi",
  "मराठी": "mr",
  "தமிழ்": "ta",
};

/** Read the active translation language code from Google's `googtrans` cookie. */
export function getActiveLang(): string {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
  return m ? m[1] : "en";
}

/** Switch the whole site to `code` via Google Translate (cookie + reload). */
export function setSiteLanguage(code: string) {
  const value = `/en/${code}`;
  const host = window.location.hostname;
  // clear any old cookie first (all common scopes)
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=;${expire};path=/`;
  document.cookie = `googtrans=;${expire};path=/;domain=${host}`;
  document.cookie = `googtrans=;${expire};path=/;domain=.${host}`;
  // for English we still set an explicit /en/en so the choice is remembered
  // (otherwise the no-cookie default would flip back to Hindi)
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${host}`;
  document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  window.location.reload();
}

/**
 * Loads the Google Website Translate widget once (hidden). The actual language
 * switch is driven by the `googtrans` cookie via setSiteLanguage().
 */
export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    // Default new visitors (no choice yet) to Hindi — set the cookie BEFORE the
    // widget initialises so it translates on first load without a reload.
    if (!document.cookie.includes("googtrans=")) {
      const host = window.location.hostname;
      document.cookie = "googtrans=/en/hi;path=/";
      document.cookie = `googtrans=/en/hi;path=/;domain=${host}`;
      document.cookie = `googtrans=/en/hi;path=/;domain=.${host}`;
    }

    // global init callback the script calls when ready
    (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit = () => {
      const g = (window as unknown as { google?: { translate?: { TranslateElement?: new (opts: object, el: string) => void } } }).google;
      if (g?.translate?.TranslateElement) {
        new g.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,hi,mr,ta", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}

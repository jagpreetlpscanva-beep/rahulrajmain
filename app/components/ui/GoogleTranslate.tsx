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

/**
 * Switch the whole site to `code` via Google Translate.
 * Uses a SINGLE host-only cookie (no domain variants) so we never end up with
 * duplicate `googtrans` cookies that make the language flip randomly. English
 * is stored explicitly as /en/en so the choice is remembered.
 */
export function setSiteLanguage(code: string) {
  // clear any stray domain-scoped cookies left over from older builds
  const host = window.location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=;${expire};path=/;domain=${host}`;
  document.cookie = `googtrans=;${expire};path=/;domain=.${host}`;
  // the one cookie that actually drives translation
  document.cookie = `googtrans=/en/${code};path=/`;
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
    // Single host-only cookie (no domain variants) to avoid duplicates.
    if (!document.cookie.includes("googtrans=")) {
      document.cookie = "googtrans=/en/hi;path=/";
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

    const load = () => {
      if (document.getElementById("google-translate-script")) return;
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    };

    const root = document.documentElement;
    const translating = root.classList.contains("gt-translating");

    if (translating) {
      // a non-English language is pending — load now and hide the splash once
      // Google has applied the translation (it adds a `translated-*` class)
      const reveal = () => root.classList.remove("gt-translating");
      const obs = new MutationObserver(() => {
        if (root.classList.contains("translated-ltr") || root.classList.contains("translated-rtl")) {
          reveal();
          obs.disconnect();
        }
      });
      obs.observe(root, { attributes: true, attributeFilter: ["class"] });
      setTimeout(reveal, 4000); // safety fallback
      load();
    } else {
      // English: no rush — load after the page is interactive
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
      if (ric) ric(load, { timeout: 1500 });
      else setTimeout(load, 800);
    }
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}

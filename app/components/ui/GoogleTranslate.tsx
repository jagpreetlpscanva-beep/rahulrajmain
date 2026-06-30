"use client";

import { useEffect } from "react";

/** Languages offered (must match the labels in lib/content LANGUAGES). */
export const LANGUAGE_CODES: Record<string, string> = {
  English: "en",
  "हिन्दी": "hi",
  "मराठी": "mr",
  "தமிழ்": "ta",
};

/** The user's chosen language (localStorage is the single source of truth). */
export function getActiveLang(): string {
  if (typeof window === "undefined") return "hi";
  try {
    return localStorage.getItem("siteLang") || "hi";
  } catch {
    return "hi";
  }
}

/**
 * Switch the whole site to `code`. We only persist the choice in localStorage;
 * the early inline script in layout.tsx turns that into the right `googtrans`
 * cookie on the next load (and clears any stray Google-set domain cookies),
 * which avoids the duplicate-cookie flip-flop. English => no cookie => original.
 */
export function setSiteLanguage(code: string) {
  try {
    localStorage.setItem("siteLang", code);
  } catch {
    /* ignore */
  }
  window.location.reload();
}

/** Loads the (hidden) Google Website Translate widget once. */
export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

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
    if (root.classList.contains("gt-translating")) {
      // a non-English language is pending — load now and hide the splash once
      // Google applies the translation (it adds a `translated-*` class)
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
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
      if (ric) ric(load, { timeout: 1500 });
      else setTimeout(load, 800);
    }
  }, []);

  return <div id="google_translate_element" className="hidden" aria-hidden />;
}

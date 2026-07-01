"use client";

import { useEffect } from "react";

/**
 * Gives every page section a subtle "rise up + fade in" as it scrolls into view.
 * The `.reveal` class is added by JS (so nothing is hidden if JS is disabled),
 * then `.reveal-in` on intersection. Re-runs on route changes via a MutationObserver.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
    );

    const prep = (el: Element) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      // if already in view on load, reveal on next frame (no flash)
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.94) {
        requestAnimationFrame(() => el.classList.add("reveal-in"));
      } else {
        io.observe(el);
      }
    };

    const scan = () => document.querySelectorAll("main > section").forEach(prep);

    scan();
    // re-scan when new content mounts (client navigations, expanding sections)
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

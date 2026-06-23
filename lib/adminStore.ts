"use client";

import { useCallback, useEffect, useState } from "react";

// re-export the server-safe model so existing imports keep working
export {
  DEFAULT_POOJAS,
  DEFAULT_REPORTS,
  DEFAULT_COURSES,
  DEFAULT_CONSULTATIONS,
  DEFAULT_GALLERY,
  DEFAULT_SLOTS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_ADDONS,
  COLLECTIONS,
  POOJA_CATEGORIES,
  COURSE_CATEGORIES,
  HERO_VISUALS,
  newId,
} from "./cms";
export type {
  Pooja,
  PoojaCategory,
  StoredReport,
  Course,
  CourseCategory,
  Consultation,
  GalleryItem,
  Slot,
  HeroSlide,
  Addon,
  CollectionKey,
} from "./cms";

/**
 * Client hook over one CMS collection, backed by the server API
 * (`/api/content/<key>`). Renders `defaults` on first paint, then loads the
 * live data. Saving writes to the server so every visitor sees the change.
 */
export function useCollection<T extends { id: string }>(key: string, defaults: T[]) {
  const [items, setItems] = useState<T[]>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/content/${key}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && Array.isArray(data)) setItems(data as T[]);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [key]);

  const save = useCallback(
    async (next: T[]) => {
      setItems(next); // optimistic
      try {
        await fetch(`/api/content/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
      } catch {
        /* network error — keep the optimistic copy on screen */
      }
    },
    [key]
  );

  const reset = useCallback(async () => {
    try {
      const r = await fetch(`/api/content/${key}`, { method: "DELETE" });
      const data = await r.json();
      if (Array.isArray(data)) setItems(data as T[]);
      else setItems(defaults);
    } catch {
      setItems(defaults);
    }
    // defaults is a module constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { items, save, reset, loaded };
}

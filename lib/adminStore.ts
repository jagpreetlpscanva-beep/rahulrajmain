"use client";

import { useCallback, useEffect, useState } from "react";
import { useServerCollection } from "./collectionsContext";

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
  DEFAULT_ARC_TILES,
  DEFAULT_REVIEWS,
  DEFAULT_PODCASTS,
  DEFAULT_DECOR,
  DEFAULT_COUPONS,
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
  ArcTile,
  Review,
  Podcast,
  DecorItem,
  Coupon,
  CollectionKey,
} from "./cms";

/**
 * Client hook over one CMS collection, backed by the server API
 * (`/api/content/<key>`). Renders `defaults` on first paint, then loads the
 * live data. Saving writes to the server so every visitor sees the change.
 */
export function useCollection<T extends { id: string }>(key: string, defaults: T[]) {
  // Server-provided data (from the root layout) renders images on first paint.
  const server = useServerCollection(key) as T[] | undefined;
  const [items, setItems] = useState<T[]>(server && server.length ? server : defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // The root layout already fetches every collection server-side per request,
    // so when that data is present it's fresh — skip the redundant client call
    // (this removes many uncached API round-trips on every page load).
    if (server && server.length) {
      setLoaded(true);
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    async (next: T[]) => {
      const prev = items; // remember in case we need to roll back
      setItems(next); // optimistic
      try {
        const res = await fetch(`/api/content/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!res.ok) {
          // The save didn't actually persist (e.g. admin session expired after
          // 12h and the API returned 401). Without this check the UI kept
          // showing the optimistic change forever, even though nothing was
          // written — so additions silently "disappeared" on next load.
          setItems(prev);
          if (res.status === 401) {
            alert("Your admin session has expired. Please log in again and retry — this change was NOT saved.");
          } else {
            alert("Save failed — this change was NOT saved. Please try again.");
          }
          return false;
        }
      } catch {
        setItems(prev);
        alert("Network error — this change was NOT saved. Please check your connection and try again.");
        return false;
      }
      return true;
    },
    [key, items]
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

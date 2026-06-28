"use client";

import { useCollection, DEFAULT_DECOR, type DecorItem } from "@/lib/adminStore";

/**
 * Built-in decoration images bundled in /public/decor. Used when no admin
 * upload exists for the slot, so the page always shows the decorations.
 */
const DECOR_DEFAULTS: Record<string, string> = {
  "courses-left": "/decor/books-lotus.png",
  "courses-right": "/decor/diya.png",
  "pooja-left": "/decor/thali.png",
  "pooja-right": "/decor/books-lotus.png",
};

/** Renders a hero decoration image by its slot id (admin upload, else bundled default). */
export function HeroDecor({ id, className = "" }: { id: string; className?: string }) {
  const { items } = useCollection<DecorItem>("decor", DEFAULT_DECOR);
  const img = items.find((d) => d.id === id)?.image || DECOR_DEFAULTS[id];
  if (!img) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={img} alt="" aria-hidden className={`pointer-events-none absolute select-none object-contain ${className}`} />;
}

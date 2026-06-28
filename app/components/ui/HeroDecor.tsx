"use client";

import { useCollection, DEFAULT_DECOR, type DecorItem } from "@/lib/adminStore";

/** Renders an admin-uploaded hero decoration image by its decor id (or nothing if unset). */
export function HeroDecor({ id, className = "" }: { id: string; className?: string }) {
  const { items } = useCollection<DecorItem>("decor", DEFAULT_DECOR);
  const img = items.find((d) => d.id === id)?.image;
  if (!img) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={img} alt="" aria-hidden className={`pointer-events-none absolute select-none object-contain ${className}`} />;
}

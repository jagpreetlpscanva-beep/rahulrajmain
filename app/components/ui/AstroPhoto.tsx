"use client";

import { useCollection, DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/adminStore";

/** Renders the astrologer photo uploaded via admin (Hero Slides), with a safe fallback. */
export function AstroPhoto({ className = "", alt = "Astro Rahul Raj" }: { className?: string; alt?: string }) {
  const { items } = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);
  const src =
    items.find((s) => s.visual === "astrologer" && s.image)?.image ||
    items.find((s) => s.image)?.image ||
    "/hero-astrologer.png";
  // eslint-disable-next-line @next/next/no-img-element
  return <img key={src} src={src} alt={alt} className={className} loading="eager" />;
}

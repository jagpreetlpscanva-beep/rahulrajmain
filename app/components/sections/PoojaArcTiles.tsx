"use client";

import { useCollection, DEFAULT_ARC_TILES, type ArcTile } from "@/lib/adminStore";
import { OmIcon } from "../icons";

const OFFSETS = ["mt-0", "mt-10", "mt-20", "mt-10", "mt-0"];

/** The fanned-out hero tiles on /online-pooja — custom images set in admin (Pooja Banner). */
export function PoojaArcTiles() {
  const { items } = useCollection<ArcTile>("poojaBanner", DEFAULT_ARC_TILES);
  // only show tiles that have an image (avoids empty red placeholder cards);
  // fall back to whatever exists if none have images yet
  const withImg = items.filter((t) => t.image);
  const tiles = (withImg.length ? withImg : items).slice(0, 5);

  return (
    <div className="mt-12 flex items-start justify-center gap-3 pb-2 sm:gap-5">
      {tiles.map((t, i) => (
        <a
          key={t.id}
          href={t.href || "#poojas"}
          className={`${OFFSETS[i % 5]} group relative grid aspect-[3/4] w-[19%] max-w-[14rem] place-items-center overflow-hidden rounded-2xl border border-white/15 shadow-xl transition-transform hover:-translate-y-1`}
          style={{ background: `linear-gradient(150deg, ${t.accent?.[0] ?? "#8E2D22"}, ${t.accent?.[1] ?? "#4E140F"})` }}
          title={t.title}
        >
          {t.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={t.image} src={t.image} alt={t.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <OmIcon className="h-12 w-12 text-cream/70 sm:h-16 sm:w-16" />
          )}
        </a>
      ))}
    </div>
  );
}

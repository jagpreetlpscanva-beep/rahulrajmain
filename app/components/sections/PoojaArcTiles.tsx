"use client";

import { useCollection, DEFAULT_POOJAS, type Pooja } from "@/lib/adminStore";
import { OmIcon } from "../icons";

const OFFSETS = ["mt-0", "mt-10", "mt-20", "mt-10", "mt-0"];
const FALLBACK: [string, string][] = [
  ["#8E2D22", "#4E140F"],
  ["#B5651D", "#6E3A10"],
  ["#9A3324", "#5A1B12"],
  ["#B5651D", "#6E3A10"],
  ["#8E2D22", "#4E140F"],
];

/** The fanned-out hero tiles on /online-pooja — shows the first poojas' cover images. */
export function PoojaArcTiles() {
  const { items } = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const tiles = items.slice(0, 5);

  return (
    <div className="mt-12 flex items-start justify-center gap-3 pb-2 sm:gap-5">
      {tiles.map((p, i) => (
        <a
          key={p.id}
          href={`/book/pooja/${p.id}`}
          className={`${OFFSETS[i % 5]} group relative grid aspect-[3/4] w-[19%] max-w-[14rem] place-items-center overflow-hidden rounded-2xl border border-white/15 shadow-xl transition-transform hover:-translate-y-1`}
          style={{ background: `linear-gradient(150deg, ${p.accent?.[0] ?? FALLBACK[i][0]}, ${p.accent?.[1] ?? FALLBACK[i][1]})` }}
          title={p.title}
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.image} src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <OmIcon className="h-12 w-12 text-cream/70 sm:h-16 sm:w-16" />
          )}
        </a>
      ))}
    </div>
  );
}

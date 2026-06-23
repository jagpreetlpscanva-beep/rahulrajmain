"use client";

import { useCollection, DEFAULT_GALLERY, type GalleryItem } from "@/lib/adminStore";
import { CrestDivider } from "../ui/Dividers";
import { MedalIcon } from "../icons";

export function Gallery() {
  const { items } = useCollection<GalleryItem>("gallery", DEFAULT_GALLERY);
  if (items.length === 0) return null;

  // duplicate the row so the marquee loops seamlessly
  const row = [...items, ...items];

  return (
    <section className="paper-bg relative overflow-hidden py-16 lg:py-20">
      <div className="container-px flex flex-col items-center text-center">
        <CrestDivider className="mb-8" />
        <span className="eyebrow text-gold-600">Honours &amp; Felicitations</span>
        <h2 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">
          Awards &amp; Recognition
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          Honoured by leaders and institutions across India for excellence in Vedic astrology.
        </p>
      </div>

      {/* edge fades */}
      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#FAF4E8] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#FAF4E8] to-transparent sm:w-28" />

        <div className="group flex w-max animate-marquee gap-5 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((item, i) => (
            <GalleryCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <figure
      className="relative h-80 w-64 shrink-0 overflow-hidden rounded-2xl border border-gold-500/25 shadow-card"
      style={{ background: `linear-gradient(150deg, ${item.accent[0]}, ${item.accent[1]})` }}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-cream">
          <MedalIcon className="h-12 w-12 text-cream/80" />
          <span className="text-xs uppercase tracking-[0.2em] text-cream/70">Award Photo</span>
        </div>
      )}
      {item.title && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 text-left text-sm font-medium leading-snug text-white">
          {item.title}
        </figcaption>
      )}
    </figure>
  );
}

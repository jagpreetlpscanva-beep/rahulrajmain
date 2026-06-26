"use client";

import { useState } from "react";
import { useCollection, DEFAULT_PODCASTS, type Podcast } from "@/lib/adminStore";
import { LotusDivider, Diamond } from "../ui/Dividers";

function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export function PodcastSection() {
  const { items } = useCollection<Podcast>("podcasts", DEFAULT_PODCASTS);
  const videos = items.filter((p) => ytId(p.videoUrl));
  const [active, setActive] = useState(0);

  if (videos.length === 0) return null;
  const cur = videos[Math.min(active, videos.length - 1)];
  const id = ytId(cur.videoUrl)!;

  return (
    <section className="relative overflow-hidden bg-night py-10 lg:py-14">
      <div className="amber-radial pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-px relative">
        <div className="text-center text-cream">
          <span className="inline-flex items-center gap-3 text-luxe-gold">
            <Diamond className="h-2.5 w-2.5" />
            <span className="eyebrow">Watch &amp; Learn</span>
            <Diamond className="h-2.5 w-2.5" />
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{cur.title}</h2>
          {cur.description && <p className="mx-auto mt-3 max-w-xl text-cream/70">{cur.description}</p>}
          <LotusDivider className="mx-auto mt-4" />
        </div>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border-2 border-luxe-gold/30 shadow-2xl">
          <div className="relative aspect-video bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${id}`}
              title={cur.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {videos.length > 1 && (
          <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-3">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActive(i)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  i === active ? "bg-gold-gradient text-night" : "border border-cream/25 text-cream/80 hover:bg-white/10"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useCollection,
  DEFAULT_POOJAS,
  POOJA_CATEGORIES,
  type Pooja,
  type PoojaCategory,
} from "@/lib/adminStore";
import { Mandala } from "../ui/Mandala";
import { LotusDivider, Diamond, Lotus } from "../ui/Dividers";
import { CalendarIcon, OmIcon } from "../icons";

const FEATURES = [
  { t: "Authentic", s: "Vedic Rituals" },
  { t: "Expert", s: "Pundits" },
  { t: "Pure & Sacred", s: "Process" },
  { t: "Blessings for", s: "All Aspects of Life" },
];

const POOJA_TRUST = [
  { t: "Need Help?", s: "Our team is here for you" },
  { t: "Talk to Expert", s: "Call: +91 94153 12590" },
  { t: "Secure & Trusted", s: "100% Safe & Confidential" },
  { t: "10,000+ Devotees", s: "Trust our puja services" },
];

function Tick() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></svg>;
}

export function PoojaGrid() {
  const { items } = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const [tab, setTab] = useState<PoojaCategory>("Upcoming");

  const visible = items.filter((p) => p.category === tab);

  return (
    <section id="poojas" className="paper-bg relative overflow-hidden py-16 lg:py-20">
      {/* decorative ornaments flanking the heading */}
      <Mandala className="pointer-events-none absolute -left-20 top-4 h-64 w-64 text-gold-600/15" />
      <Lotus className="pointer-events-none absolute left-8 top-28 hidden h-16 w-24 text-gold-500/30 lg:block" />
      <Mandala className="pointer-events-none absolute -right-20 top-4 h-64 w-64 text-gold-600/15" />
      <Lotus className="pointer-events-none absolute right-8 top-28 hidden h-16 w-24 text-gold-500/30 lg:block" />
      <div className="container-px relative">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-50 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold-700">
            <Diamond className="h-2.5 w-2.5" /> Experience Real Blessings <Diamond className="h-2.5 w-2.5" />
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
            <span className="text-ink">Personalized Pujas, </span>
            <span className="text-gold-600">Performed For You</span>
          </h2>
          <p className="mt-3 text-base text-ink/65 sm:text-lg">
            Experience real blessings with your personal sankalp
          </p>
          <LotusDivider className="mx-auto mt-4" />
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {FEATURES.map((f) => (
              <div key={f.t} className="flex items-center gap-2 text-left">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-500 to-[#7A5212] text-cream"><Tick /></span>
                <span>
                  <span className="block text-sm font-bold leading-tight text-ink">{f.t}</span>
                  <span className="block text-xs text-ink/55">{f.s}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* category tabs */}
        <div className="mt-10 flex gap-7 overflow-x-auto border-b border-gold-500/20 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {POOJA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTab(cat)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-semibold transition-colors sm:text-base ${
                tab === cat ? "text-ink" : "text-ink/45 hover:text-ink/70"
              }`}
            >
              {cat}
              {tab === cat && (
                <motion.span
                  layoutId="pooja-tab-underline"
                  className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-gold-gradient"
                />
              )}
            </button>
          ))}
        </div>

        {/* cards */}
        {visible.length > 0 ? (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((pooja) => (
              <PujaCard key={pooja.id} pooja={pooja} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-ink/55">
            No pujas in this category yet. Add some from the admin panel.
          </p>
        )}

        {/* trust bar */}
        <div className="mt-12 grid gap-5 rounded-2xl border border-gold-500/20 bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {POOJA_TRUST.map((t) => (
            <div key={t.t} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600"><Tick /></span>
              <div>
                <p className="text-sm font-bold leading-tight text-ink">{t.t}</p>
                <p className="text-xs text-ink/55">{t.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PujaCard({ pooja }: { pooja: Pooja }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-[#FBF1D9] shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* banner */}
      <div className="bg-gold-gradient px-4 py-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.15em] text-night">
        {pooja.badge}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-center font-serif text-xl font-bold leading-snug text-ink">
          {pooja.title}
        </h3>

        {/* cover */}
        <div
          className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl"
          style={{ background: `linear-gradient(150deg, ${pooja.accent[0]}, ${pooja.accent[1]})` }}
        >
          {pooja.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pooja.image} alt={pooja.title} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-cream/90">
              <Mandala className="absolute inset-0 m-auto h-4/5 w-4/5 text-white/10" />
              <OmIcon className="relative h-12 w-12" />
            </div>
          )}
        </div>

        {pooja.eventDate && <Countdown target={pooja.eventDate} />}

        <p className="mt-4 text-sm leading-relaxed text-ink/75">{pooja.description}</p>

        <div className="mt-3 space-y-1.5 text-sm text-ink/70">
          {pooja.venue && (
            <p className="flex items-center gap-2">
              <TempleIcon className="h-4 w-4 shrink-0 text-gold-600" />
              {pooja.venue}
            </p>
          )}
          {pooja.date && (
            <p className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0 text-gold-600" />
              {pooja.date}
            </p>
          )}
        </div>

        <a
          href={`/book/pooja/${pooja.id}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
        >
          Participate →
        </a>
      </div>
    </motion.article>
  );
}

function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // reserve height before mount to avoid layout shift; nothing once expired
  if (now === null) return <div className="mt-4 h-[58px]" />;
  const diff = new Date(`${target}T00:00:00`).getTime() - now;
  if (diff <= 0) return null;

  const units: [number, string][] = [
    [Math.floor(diff / 86_400_000), "DAYS"],
    [Math.floor(diff / 3_600_000) % 24, "HRS"],
    [Math.floor(diff / 60_000) % 60, "MIN"],
    [Math.floor(diff / 1_000) % 60, "SEC"],
  ];

  return (
    <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-lg border border-gold-500/25 bg-white text-center">
      {units.map(([value, label], i) => (
        <div key={label} className={`py-2 ${i > 0 ? "border-l border-gold-500/15" : ""}`}>
          <div className="font-serif text-lg font-bold leading-none text-ink">
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.55rem] font-semibold tracking-wider text-ink/55">{label}</div>
        </div>
      ))}
    </div>
  );
}

function TempleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2 3h-4l2-3Z" />
      <path d="M5 21V11l7-4 7 4v10" />
      <path d="M3 21h18M10 21v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

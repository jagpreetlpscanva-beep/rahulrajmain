"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCollection, DEFAULT_POOJAS, type Pooja } from "@/lib/adminStore";
import { Mandala } from "../ui/Mandala";
import { LotusDivider, Diamond } from "../ui/Dividers";
import { IconImage } from "../ui/IconImage";
import { OmIcon, ArrowRightIcon } from "../icons";

const BADGES = [
  { id: "authentic", icon: <ShieldSvg />, title: "Authentic Vedic Rituals", sub: "Traditional rituals with purity" },
  { id: "pandits", icon: <PersonSvg />, title: "Experienced Pandits", sub: "Verified & seasoned experts" },
  { id: "secure", icon: <LockSvg />, title: "Secure & Private", sub: "100% safe & confidential" },
  { id: "easy", icon: <ClockSvg />, title: "Easy & Convenient", sub: "Puja at your time, from anywhere" },
];

export function OnlinePoojaSection() {
  const { items } = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const [open, setOpen] = useState(false);
  const poojas = items.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-[#faf4e8] py-9 lg:py-12">
      {/* decorative watermarks */}
      <Mandala className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 text-gold-600/[0.08]" />
      <OmIcon className="pointer-events-none absolute right-10 top-24 hidden h-28 w-28 text-gold-600/[0.07] lg:block" />
      <Mandala className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 text-gold-600/[0.06]" />

      <div className="container-px relative">
        {/* heading */}
        <div className="text-center">
          <h2 className="inline-flex items-center justify-center gap-3 font-serif text-3xl font-bold text-ink sm:text-4xl">
            <Diamond className="h-3 w-3 text-gold-500" />
            Divine Poojas, Personalized for You
            <Diamond className="h-3 w-3 text-gold-500" />
          </h2>
          <LotusDivider className="mx-auto mt-4" />
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
            Experience the power of <span className="font-semibold text-gold-700">Vedic rituals</span> performed by
            expert pandits from the comfort of your home.
          </p>
        </div>

        {/* slide-down toggle card */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mx-auto mt-9 flex w-full max-w-4xl items-center gap-5 rounded-3xl border-2 border-gold-500/40 bg-white p-5 text-left shadow-card-hover transition-colors hover:border-gold-500/60 sm:p-6"
        >
          <span className="relative grid h-20 w-20 shrink-0 place-items-center text-cream sm:h-24 sm:w-24">
            {/* glowing gold disc behind the logo */}
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(233,190,99,0.75),rgba(201,145,47,0.3)_60%,transparent_75%)] blur-[2px]" />
            <IconImage src="/online-pooja/main.png" alt="Online Pooja" className="relative h-16 w-16 drop-shadow-[0_5px_14px_rgba(192,138,46,0.55)] sm:h-20 sm:w-20">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-500 to-[#7A5212] sm:h-20 sm:w-20"><OmIcon className="h-9 w-9 sm:h-11 sm:w-11" /></span>
            </IconImage>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-2xl font-bold text-ink sm:text-3xl">Online Pooja</span>
            <LotusDivider className="my-2 !justify-start" />
            <span className="block text-sm text-ink/55 sm:text-base">Personalized pujas performed for you — tap to view</span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-white text-gold-600 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.span>
        </button>

        {/* slide-down content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mx-auto mt-8 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {poojas.map((p) => (
                  <a
                    key={p.id}
                    href={`/book/pooja/${p.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {p.badge && (
                      <div className="bg-gold-gradient px-4 py-1.5 text-center text-[0.6rem] font-bold uppercase tracking-[0.15em] text-night">
                        {p.badge}
                      </div>
                    )}
                    <div
                      className="relative aspect-[16/10] overflow-hidden"
                      style={{ background: `linear-gradient(150deg, ${p.accent?.[0] ?? "#C08A2E"}, ${p.accent?.[1] ?? "#7A5212"})` }}
                    >
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-cream/90">
                          <Mandala className="absolute inset-0 m-auto h-4/5 w-4/5 text-white/10" />
                          <OmIcon className="relative h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-serif text-lg font-bold leading-snug text-ink">{p.title}</h3>
                      {p.description && <p className="mt-1 line-clamp-2 text-sm text-ink/65">{p.description}</p>}
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
                        Participate <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="/online-pooja"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
                >
                  Explore More Poojas <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* trust badges */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {BADGES.map((b) => (
            <div key={b.title} className="flex items-center gap-3 rounded-2xl border border-gold-500/15 bg-white/70 px-4 py-3 shadow-[0_12px_30px_-22px_rgba(120,80,20,0.6)]">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center text-gold-600">
                {/* soft gold glow behind the logo */}
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,213,138,0.6),transparent_70%)] blur-[4px]" />
                <IconImage src={`/online-pooja/${b.id}.png`} alt={b.title} className="relative h-9 w-9 drop-shadow-[0_3px_8px_rgba(192,138,46,0.45)]">
                  {b.icon}
                </IconImage>
              </span>
              <span>
                <span className="block text-sm font-bold leading-tight text-ink">{b.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-ink/55">{b.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- inline icons ---------------- */
function ShieldSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function PersonSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}
function LockSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function ClockSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}

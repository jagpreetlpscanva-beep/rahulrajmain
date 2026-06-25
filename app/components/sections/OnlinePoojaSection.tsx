"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCollection, DEFAULT_POOJAS, type Pooja } from "@/lib/adminStore";
import { optimizeImage } from "@/lib/content";
import { Mandala } from "../ui/Mandala";
import { OmIcon, ArrowRightIcon } from "../icons";

export function OnlinePoojaSection() {
  const { items } = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const [open, setOpen] = useState(false);
  const poojas = items.slice(0, 6);

  return (
    <section className="bg-[#faf4e8] py-12 lg:py-16">
      <div className="container-px">
        {/* slide-down toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-2xl border-2 border-gold-500/30 bg-white px-5 py-4 shadow-card transition-colors hover:border-gold-500/50 sm:px-6 sm:py-5"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient text-cream shadow-[0_8px_22px_-6px_rgba(192,138,46,0.7)]">
              <OmIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-serif text-lg font-bold text-ink sm:text-xl">Online Pooja</span>
              <span className="block text-xs text-ink/55 sm:text-sm">Personalized pujas performed for you — tap to view</span>
            </span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                        <img src={optimizeImage(p.image, 600)} alt={p.title} className="h-full w-full object-cover" />
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
      </div>
    </section>
  );
}

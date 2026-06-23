"use client";

import { motion } from "framer-motion";
import { useCollection, DEFAULT_CONSULTATIONS, type Consultation } from "@/lib/adminStore";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { CrestDivider, LotusDivider } from "../ui/Dividers";

export function ConsultationGrid() {
  const { items } = useCollection<Consultation>("consultations", DEFAULT_CONSULTATIONS);

  return (
    <section id="consult-types" className="paper-bg relative py-16 lg:py-24">
      <div className="container-px">
        <Reveal className="flex flex-col items-center text-center">
          <CrestDivider className="mb-8" />
          <span className="eyebrow text-gold-600">Choose Your Consultation</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem]">
            Consultations For Every Question
          </h2>
          <LotusDivider className="my-6" />
          <p className="max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Pick the consultation that fits your need — each one is one-on-one, private, and
            tailored to your birth chart.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <RevealItem key={c.id}>
              <ConsultationCard consultation={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ConsultationCard({ consultation: c }: { consultation: Consultation }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-white/70 p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {c.badge && (
        <span className="absolute right-4 top-4 rounded-md bg-gold-gradient px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-night shadow-sm">
          {c.badge}
        </span>
      )}

      <span
        className="h-1.5 w-12 rounded-full"
        style={{ background: `linear-gradient(90deg, ${c.accent[0]}, ${c.accent[1]})` }}
      />
      <h3 className="mt-4 font-serif text-xl font-bold leading-snug text-ink">{c.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{c.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {c.duration && (
          <span className="rounded-full bg-gold-100 px-3 py-1 font-semibold text-gold-700">⏱ {c.duration}</span>
        )}
        {c.mode && (
          <span className="rounded-full bg-gold-100 px-3 py-1 font-semibold text-gold-700">{c.mode}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gold-500/15 pt-5">
        {c.price && <span className="font-serif text-2xl font-bold text-ink">{c.price}</span>}
        <a
          href={`/book/consultation/${c.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
        >
          Book Now →
        </a>
      </div>
    </motion.article>
  );
}

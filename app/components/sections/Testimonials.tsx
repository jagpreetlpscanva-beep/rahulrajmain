"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/content";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "../icons";
import { Diamond } from "../ui/Dividers";

function usePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return perView;
}

export function Testimonials() {
  const perView = usePerView();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const canPrev = index > 0;
  const canNext = index < maxIndex;

  return (
    <section id="testimonials" className="paper-bg relative pb-20 pt-2">
      <div className="container-px">
        {/* heading */}
        <div className="mb-10 flex items-center justify-center gap-4 text-gold-500">
          <span className="hidden h-px w-10 bg-gold-400/50 sm:block" />
          <Diamond className="h-3 w-3" />
          <h2 className="text-center font-serif text-lg font-semibold uppercase tracking-[0.15em] text-ink sm:text-xl">
            What People Say About Rahul Raj
          </h2>
          <Diamond className="h-3 w-3" />
          <span className="hidden h-px w-10 bg-gold-400/50 sm:block" />
        </div>

        <div className="relative px-2 sm:px-12">
          {/* arrows */}
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold-400/50 bg-cream text-gold-600 transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-30 sm:-translate-x-1"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={!canNext}
            className="absolute right-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold-400/50 bg-cream text-gold-600 transition hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-30 sm:translate-x-1"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* track */}
          <div className="overflow-hidden">
            <motion.ul
              className="flex"
              animate={{ x: `-${index * (100 / perView)}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
            >
              {TESTIMONIALS.map((t) => (
                <li
                  key={t.name}
                  className="shrink-0 px-2.5"
                  style={{ width: `${100 / perView}%` }}
                >
                  <TestimonialCard {...t} />
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* dots */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold-500" : "w-2 bg-gold-400/30 hover:bg-gold-400/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  location,
  initials,
  rating,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-gold-500/15 bg-white/60 p-5 shadow-[0_8px_24px_-14px_rgba(61,40,23,0.25)]">
      <div className="flex items-start gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-gradient font-serif text-sm font-bold text-night ring-2 ring-white"
          aria-hidden="true"
        >
          {initials}
        </span>
        <p className="text-sm leading-relaxed text-ink/85">
          <span className="text-gold-500">&ldquo;</span>
          {quote}
          <span className="text-gold-500">&rdquo;</span>
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-xs font-semibold text-ink">
          – {name}, {location}
        </p>
        <div className="mt-1.5 flex gap-0.5 text-gold-500">
          {Array.from({ length: rating }).map((_, i) => (
            <StarIcon key={i} className="h-3.5 w-3.5" />
          ))}
        </div>
      </div>
    </div>
  );
}

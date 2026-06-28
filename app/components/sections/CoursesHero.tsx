"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CoursesGrid, CATEGORY_ICONS } from "./CoursesGrid";
import { COURSE_CATEGORIES, type CourseCategory } from "@/lib/adminStore";
import { HeroDecor } from "../ui/HeroDecor";

/* ---------------------------------------------------------------------- */
/*  Decorative background — one continuous illustrated band spanning the   */
/*  full hero width (lotus + diya + books on the left, armillary sphere + */
/*  candle on the right), instead of isolated corner icons.                */
/* ---------------------------------------------------------------------- */

function HeroOrnamentBand() {
  return (
    <svg
      viewBox="0 0 1600 320"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-gold-600/[0.16]"
      fill="none"
      aria-hidden="true"
    >
      {/* soft ground gradient strip so the ornaments feel grounded, not floating */}
      <ellipse cx="180" cy="300" rx="320" ry="60" fill="currentColor" opacity="0.35" />
      <ellipse cx="1420" cy="300" rx="320" ry="60" fill="currentColor" opacity="0.35" />

      {/* ---------- left cluster: stacked books + brass diya + lotus ---------- */}
      <g transform="translate(40 150)">
        <rect x="0" y="120" width="120" height="22" rx="3" fill="currentColor" opacity="0.6" />
        <rect x="14" y="98" width="98" height="22" rx="3" fill="currentColor" opacity="0.75" />
        <rect x="6" y="76" width="106" height="22" rx="3" fill="currentColor" opacity="0.9" />
        {/* diya / oil lamp */}
        <path d="M168 142h56M196 142v-30M174 112h44a22 22 0 0 1-44 0Z" stroke="currentColor" strokeWidth="4" />
        <path d="M196 112V88" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M196 76c6 0 9 6 6 12-3-3-9-3-12 0-3-6 0-12 6-12Z" fill="currentColor" />
        {/* lotus bloom */}
        <path
          d="M286 142c0-18 7-30 18-39 4 14 1 27-18 39Zm0 0c0-18-7-30-18-39-4 14-1 27 18 39Zm0 0c10-6 19-4 27 0-5 10-13 15-27 0Zm0 0c-10-6-19-4-27 0 5 10 13 15 27 0Zm0 0v22m-44 0h88"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* scattered petals */}
        <circle cx="330" cy="156" r="6" fill="currentColor" opacity="0.5" />
        <circle cx="356" cy="168" r="4.5" fill="currentColor" opacity="0.4" />
        <circle cx="20" cy="158" r="5" fill="currentColor" opacity="0.4" />
      </g>

      {/* ---------- right cluster: armillary sphere + candle ---------- */}
      <g transform="translate(1180 140)">
        <circle cx="220" cy="60" r="52" stroke="currentColor" strokeWidth="3.5" />
        <ellipse cx="220" cy="60" rx="52" ry="20" stroke="currentColor" strokeWidth="2.8" />
        <ellipse cx="220" cy="60" rx="20" ry="52" stroke="currentColor" strokeWidth="2.8" />
        <path d="M220 8v104M168 60h104" stroke="currentColor" strokeWidth="2.2" />
        <path d="M220 112v36M188 148h64" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* candle */}
        <rect x="40" y="106" width="34" height="42" rx="3" fill="currentColor" opacity="0.7" />
        <path d="M57 106V82" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M57 70c6 0 9 6 6 12-3-3-9-3-12 0-3-6 0-12 6-12Z" fill="currentColor" />
        {/* scattered petals */}
        <circle cx="12" cy="160" r="6" fill="currentColor" opacity="0.45" />
        <circle cx="116" cy="172" r="4.5" fill="currentColor" opacity="0.4" />
        <circle cx="318" cy="150" r="5" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
}

/**
 * Client-side hero + tabs + grid for the courses page. Kept as a single
 * client component so the icon tabs (in the compact banner) and the
 * CoursesGrid below can share the same `activeCategory` state — while
 * `app/courses/page.tsx` itself stays a server component so its
 * `metadata` export keeps working.
 */
export function CoursesHero() {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>(COURSE_CATEGORIES[0]);

  return (
    <>
      {/* ---------------- compact hero banner ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream pt-36 lg:pt-40">
        {/* dark strip behind the fixed navbar so its light text stays readable
            against this page's light hero (navbar switches to dark text only
            after scrolling) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/90 via-night/40 to-transparent lg:h-28" />

        <HeroOrnamentBand />
        {/* decoration images flanking the hero (books+lotus left, diya right) */}
        <HeroDecor id="courses-left" className="bottom-2 left-0 z-[1] hidden w-44 lg:block xl:w-56" />
        <HeroDecor id="courses-right" className="bottom-2 right-4 z-[1] hidden w-24 lg:block xl:w-32" />

        <div className="container-px relative pb-10 text-center lg:pb-12">
          <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold-600">
            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
              <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
            </svg>
            Learn with Rahul Raj
            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
              <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
            </svg>
          </span>
          <h1 className="mx-auto mt-2 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-[2.25rem]">
            Courses &amp; <span className="text-gold-600">Recorded Sessions</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Self-paced video courses and recorded masterclasses — learn the sacred sciences at
            your own pace, anytime.
          </p>

          {/* icon category tabs */}
          <div className="relative z-10 mx-auto mt-6 flex max-w-3xl flex-wrap items-stretch justify-center gap-1 rounded-2xl border border-gold-500/15 bg-white px-3 py-3 shadow-card sm:gap-2">
            {COURSE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="relative flex min-w-[5.5rem] flex-1 flex-col items-center gap-2 rounded-xl px-3 py-2.5 transition-colors sm:min-w-[6.5rem]"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                      active
                        ? "border-gold-500 bg-gold-50 text-gold-600"
                        : "border-ink/10 text-ink/45 hover:text-ink/70"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`text-xs font-semibold ${active ? "text-gold-600" : "text-ink/55"}`}>
                    {cat}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="courses-tab-underline"
                      className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gold-gradient"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CoursesGrid activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
    </>
  );
}

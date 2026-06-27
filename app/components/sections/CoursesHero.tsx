"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CoursesGrid, CATEGORY_ICONS } from "./CoursesGrid";
import { COURSE_CATEGORIES, type CourseCategory } from "@/lib/adminStore";

/* ---------------------------------------------------------------------- */
/*  Decorative ornaments — simple inline SVGs in the site's gold/ink tone  */
/* ---------------------------------------------------------------------- */

function LeftOrnament() {
  return (
    <svg
      viewBox="0 0 240 140"
      className="pointer-events-none absolute -left-6 bottom-2 hidden h-32 w-52 text-gold-500/40 md:block lg:-left-2 lg:h-40 lg:w-64 xl:left-6"
      fill="none"
      aria-hidden="true"
    >
      {/* stacked books */}
      <rect x="6" y="96" width="78" height="14" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="14" y="82" width="66" height="14" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="10" y="68" width="72" height="14" rx="2" fill="currentColor" opacity="0.85" />
      {/* oil lamp */}
      <path d="M120 110h36M138 110V92M124 92h28a14 14 0 0 1-28 0Z" stroke="currentColor" strokeWidth="3" />
      <path d="M138 92V78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M138 70c4 0 6 4 4 8-2-2-6-2-8 0-2-4 0-8 4-8Z" fill="currentColor" />
      {/* lotus */}
      <path
        d="M196 110c0-12 5-20 12-26 3 9 1 18-12 26Zm0 0c0-12-5-20-12-26-3 9-1 18 12 26Zm0 0c7-4 13-3 18 0-3 7-9 10-18 0Zm0 0c-7-4-13-3-18 0 3 7 9 10 18 0Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function RightOrnament() {
  return (
    <svg
      viewBox="0 0 240 140"
      className="pointer-events-none absolute -right-6 bottom-2 hidden h-32 w-52 text-gold-500/40 md:block lg:-right-2 lg:h-40 lg:w-64 xl:right-6"
      fill="none"
      aria-hidden="true"
    >
      {/* armillary sphere */}
      <circle cx="170" cy="68" r="34" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="170" cy="68" rx="34" ry="13" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="170" cy="68" rx="13" ry="34" stroke="currentColor" strokeWidth="2" />
      <path d="M170 34v68M136 68h68" stroke="currentColor" strokeWidth="1.6" />
      <path d="M170 102v18M150 120h40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* candle */}
      <rect x="34" y="86" width="22" height="24" rx="2" fill="currentColor" opacity="0.75" />
      <path d="M45 86V74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M45 66c4 0 6 4 4 8-2-2-6-2-8 0-2-4 0-8 4-8Z" fill="currentColor" />
      {/* petals scattered */}
      <circle cx="14" cy="112" r="4.5" fill="currentColor" opacity="0.5" />
      <circle cx="92" cy="120" r="3.5" fill="currentColor" opacity="0.5" />
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
      <section className="relative overflow-hidden bg-cream pt-36 lg:pt-40">
        <LeftOrnament />
        <RightOrnament />

        <div className="container-px relative pb-7 text-center lg:pb-8">
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

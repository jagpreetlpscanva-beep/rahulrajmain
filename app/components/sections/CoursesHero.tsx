"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CoursesGrid, CATEGORY_ICONS } from "./CoursesGrid";
import { COURSE_CATEGORIES, type CourseCategory } from "@/lib/adminStore";
import { HeroDecor } from "../ui/HeroDecor";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream pt-24 lg:pt-28">
        {/* decoration images flanking the hero (books+lotus left, diya right) */}
        <HeroDecor id="courses-left" className="bottom-2 left-0 z-[1] hidden w-44 lg:block xl:w-56" />
        <HeroDecor id="courses-right" className="bottom-2 right-4 z-[1] hidden w-24 lg:block xl:w-32" />

        <div className="container-px relative pb-6 text-center lg:pb-8">
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

"use client";

import { useEffect, useMemo, useState } from "react";
import type { SVGProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCollection,
  DEFAULT_COURSES,
  COURSE_CATEGORIES,
  type Course,
  type CourseCategory,
} from "@/lib/adminStore";
import { Mandala } from "../ui/Mandala";

/* ---------------------------------------------------------------------- */
/*  Small inline icons (kept local to this file — no shared icon deps)    */
/* ---------------------------------------------------------------------- */

type IconProps = SVGProps<SVGSVGElement>;

const SunIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path
      strokeLinecap="round"
      d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"
    />
  </svg>
);

const NumerologyIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3v7M5 11h3M5 20l3-7M13 4h2.5a2.5 2.5 0 0 1 0 5H13V4Zm0 5h2a3 3 0 0 1 0 6h-2" />
  </svg>
);

const HomeIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5 12 4l8 7.5M6 9.5V20h12V9.5M10 20v-6h4v6" />
  </svg>
);

const PalmIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 11.5V5a1.5 1.5 0 0 1 3 0v5M11 10V4a1.5 1.5 0 0 1 3 0v6M14 10.2V5.3a1.5 1.5 0 0 1 3 0v7.2M17 10.8a1.4 1.4 0 0 1 2.8.2c0 3.2-.4 5.2-1.6 6.9-1.2 1.7-3 2.6-5.2 2.6h-1.3c-1.7 0-2.8-.5-3.8-1.7L4.6 14.4a1.3 1.3 0 0 1 1.9-1.8L8 14"
    />
  </svg>
);

const LotusIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 13c0-4.5 2-7.5 4.5-9.5C17 7 16 11 12 13Zm0 0c0-4.5-2-7.5-4.5-9.5C7 7 8 11 12 13Zm0 0c2.8-1.6 5-1.4 7-.2-1.2 2.6-3.6 4-7 4.2Zm0 0c-2.8-1.6-5-1.4-7-.2 1.2 2.6 3.6 4 7 4.2Zm0 0v6.5M6 19.5h12"
    />
  </svg>
);

const StarFillIcon = (p: IconProps) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
    <path d="M10 1.6l2.47 5.27 5.73.69-4.27 3.95 1.16 5.69L10 14.4l-5.09 2.8 1.16-5.69-4.27-3.95 5.73-.69L10 1.6z" />
  </svg>
);

const ClockIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 7.5V12l3 2" />
  </svg>
);

const LessonsIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h11.5A2.5 2.5 0 0 1 18 8v11H6.5A2.5 2.5 0 0 1 4 16.5v-11Z" />
    <path strokeLinecap="round" d="M18 8h2v11h-2" />
  </svg>
);

const FilterIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

const CertificateIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5 7.5 21l4.5-2.3 4.5 2.3-1.5-7.5" />
  </svg>
);

const InfinityIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <path d="M7 9a3.5 3.5 0 1 0 0 7c1.8 0 2.9-1.4 5-4.5C14.1 8.4 15.2 7 17 7a3.5 3.5 0 1 1 0 7c-1.8 0-2.9-1.4-5-4.5" />
  </svg>
);

const GuideIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="7.5" r="3.2" />
    <path strokeLinecap="round" d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" />
  </svg>
);

const MobileIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.3" />
    <path strokeLinecap="round" d="M10.5 18.3h3" />
  </svg>
);

const LockIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path strokeLinecap="round" d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
);

const HeadsetIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <path strokeLinecap="round" d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <rect x="3" y="13" width="4" height="6" rx="1.6" />
    <rect x="17" y="13" width="4" height="6" rx="1.6" />
    <path strokeLinecap="round" d="M19 19v.5a3 3 0 0 1-3 3h-2" />
  </svg>
);

/* ---------------------------------------------------------------------- */
/*  Static config                                                         */
/* ---------------------------------------------------------------------- */

export const CATEGORY_ICONS: Record<CourseCategory, (p: IconProps) => React.JSX.Element> = {
  Astrology: SunIcon,
  Numerology: NumerologyIcon,
  Vastu: HomeIcon,
  Palmistry: PalmIcon,
  Spiritual: LotusIcon,
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

const SORTS = ["Newest First", "Price: Low to High", "Price: High to Low", "Top Rated"] as const;
type SortKey = (typeof SORTS)[number];

const TRUST_STRIP = [
  { icon: InfinityIcon, title: "Lifetime Access", sub: "Learn at your own pace" },
  { icon: CertificateIcon, title: "Certificate", sub: "Upon Completion" },
  { icon: GuideIcon, title: "Expert Guidance", sub: "From Rahul Raj" },
  { icon: MobileIcon, title: "Mobile Friendly", sub: "Study Anywhere" },
  { icon: LockIcon, title: "Secure Payment", sub: "100% Safe & Secure" },
  { icon: HeadsetIcon, title: "24/7 Support", sub: "We're Here to Help" },
];

function priceToNumber(price: string) {
  const n = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/* ---------------------------------------------------------------------- */
/*  Main section                                                          */
/* ---------------------------------------------------------------------- */

export function CoursesGrid({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: CourseCategory;
  onCategoryChange: (cat: CourseCategory) => void;
}) {
  const { items } = useCollection<Course>("courses", DEFAULT_COURSES);

  const [sidebarCategory, setSidebarCategory] = useState<CourseCategory | "All">("All");
  const [levels, setLevels] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(5499);
  const [sort, setSort] = useState<SortKey>("Newest First");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSidebarCategory("All");
  }, [activeCategory]);

  const PRICE_FLOOR = 499;
  const PRICE_CEIL = useMemo(
    () => Math.max(5499, ...items.map((c) => priceToNumber(c.price))),
    [items]
  );

  const counts = useMemo(() => {
    const map = new Map<CourseCategory, number>();
    for (const cat of COURSE_CATEGORIES) map.set(cat, items.filter((c) => c.category === cat).length);
    return map;
  }, [items]);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    let list = items.filter((c) => c.category === activeCategory);
    if (sidebarCategory !== "All") list = list.filter((c) => c.category === sidebarCategory);
    if (levels.length) list = list.filter((c) => levels.includes(c.level));
    list = list.filter((c) => priceToNumber(c.price) <= maxPrice);
    if (features.includes("Certificate Included")) list = list.filter((c) => c.certificate);
    if (features.includes("Lifetime Access")) list = list.filter((c) => c.lifetimeAccess);
    if (features.includes("Downloadable Resources")) list = list.filter((c) => c.downloadableResources);
    if (features.includes("Mobile Friendly")) list = list.filter((c) => c.mobileFriendly);

    const sorted = [...list];
    if (sort === "Price: Low to High") sorted.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    else if (sort === "Price: High to Low") sorted.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    else if (sort === "Top Rated") sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return sorted;
  }, [items, activeCategory, sidebarCategory, levels, features, maxPrice, sort]);

  const allInTab = items.filter((c) => c.category === activeCategory).length;

  return (
    <section id="courses-list" className="paper-bg relative py-12 lg:py-16">
      <div className="container-px">
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          {/* ---------------- sidebar ---------------- */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="mb-4 flex w-full items-center justify-between rounded-xl border border-gold-500/25 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-card lg:hidden"
            >
              <span className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-gold-600" /> Filters
              </span>
              <span className="text-ink/50">{mobileFiltersOpen ? "Hide" : "Show"}</span>
            </button>

            <AnimatePresence initial={false}>
              {(mobileFiltersOpen || true) && (
                <motion.div
                  initial={false}
                  animate={{ height: "auto" }}
                  className={`overflow-hidden rounded-2xl border border-gold-500/20 bg-white p-5 shadow-card ${
                    mobileFiltersOpen ? "block" : "hidden lg:block"
                  }`}
                >
                  {/* categories */}
                  <div>
                    <h3 className="eyebrow text-ink/50">Categories</h3>
                    <ul className="mt-3 space-y-1">
                      <li>
                        <button
                          type="button"
                          onClick={() => setSidebarCategory("All")}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
                            sidebarCategory === "All"
                              ? "bg-gold-50 text-gold-700"
                              : "text-ink/75 hover:bg-ink/[0.04]"
                          }`}
                        >
                          All Courses
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              sidebarCategory === "All" ? "bg-gold-100 text-gold-700" : "bg-ink/5 text-ink/50"
                            }`}
                          >
                            {items.length}
                          </span>
                        </button>
                      </li>
                      {COURSE_CATEGORIES.map((cat) => (
                        <li key={cat}>
                          <button
                            type="button"
                            onClick={() => {
                              setSidebarCategory(cat);
                              onCategoryChange(cat);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
                              sidebarCategory === cat
                                ? "bg-gold-50 font-semibold text-gold-700"
                                : "text-ink/70 hover:bg-ink/[0.04]"
                            }`}
                          >
                            {cat}
                            <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/50">
                              {counts.get(cat) ?? 0}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* price range */}
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <h3 className="eyebrow text-ink/50">Price Range</h3>
                    <input
                      type="range"
                      min={PRICE_FLOOR}
                      max={PRICE_CEIL}
                      step={100}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-gold-500"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs font-medium text-ink/55">
                      <span>₹{PRICE_FLOOR.toLocaleString("en-IN")}</span>
                      <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMaxPrice(PRICE_CEIL)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
                    >
                      <FilterIcon className="h-3.5 w-3.5" /> Apply Filter
                    </button>
                  </div>

                  {/* level */}
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <h3 className="eyebrow text-ink/50">Level</h3>
                    <ul className="mt-3 space-y-2.5">
                      {LEVELS.map((lvl) => (
                        <li key={lvl}>
                          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/75">
                            <input
                              type="checkbox"
                              checked={levels.includes(lvl)}
                              onChange={() => toggle(levels, setLevels, lvl)}
                              className="h-4 w-4 rounded border-ink/25 text-gold-600 focus:ring-gold-400"
                            />
                            {lvl}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* features */}
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <h3 className="eyebrow text-ink/50">Features</h3>
                    <ul className="mt-3 space-y-2.5">
                      {["Certificate Included", "Lifetime Access", "Downloadable Resources", "Mobile Friendly"].map(
                        (f) => (
                          <li key={f}>
                            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink/75">
                              <input
                                type="checkbox"
                                checked={features.includes(f)}
                                onChange={() => toggle(features, setFeatures, f)}
                                className="h-4 w-4 rounded border-ink/25 text-gold-600 focus:ring-gold-400"
                              />
                              {f}
                            </label>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* ---------------- results ---------------- */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink/60">
                Showing <span className="font-bold text-ink">{filtered.length}</span>{" "}
                {filtered.length === allInTab ? "results" : `of ${allInTab} results`}
              </p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink/75 shadow-sm transition-colors hover:border-gold-400"
                >
                  {sort}
                  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_26px_60px_-15px_rgba(45,27,18,0.35)] ring-1 ring-ink/10"
                    >
                      {SORTS.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => {
                              setSort(s);
                              setSortOpen(false);
                            }}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gold-50 ${
                              s === sort ? "font-semibold text-gold-700" : "text-ink/75"
                            }`}
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course, i) => (
                  <CourseCard key={course.id} course={course} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gold-500/30 bg-white/60 py-16 text-center">
                <p className="text-ink/55">No courses match these filters yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSidebarCategory("All");
                    setLevels([]);
                    setFeatures([]);
                    setMaxPrice(PRICE_CEIL);
                  }}
                  className="mt-4 text-sm font-semibold text-gold-600 underline-offset-4 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- trust strip ---------------- */}
        <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-gold-500/15 bg-white/70 p-6 shadow-card sm:grid-cols-3 lg:grid-cols-6 lg:gap-3 lg:p-5">
          {TRUST_STRIP.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{title}</span>
                <span className="block text-xs text-ink/55">{sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/*  Course card                                                            */
/* ---------------------------------------------------------------------- */

function CourseCard({ course, priority }: { course: Course; priority?: boolean }) {
  const watchHref = course.videoUrl || `/book/course/${course.id}`;
  const badgeTone =
    course.badge?.toLowerCase() === "bestseller"
      ? "bg-orange-500 text-white"
      : course.badge?.toLowerCase() === "new"
        ? "bg-emerald-500 text-white"
        : "bg-gold-gradient text-night";

  const levelTone =
    course.level === "Beginner"
      ? "bg-emerald-100 text-emerald-700"
      : course.level === "Advanced"
        ? "bg-rose-100 text-rose-700"
        : "bg-violet-100 text-violet-700";

  const [lessonsPart, durationPart] = course.lessons.split("·").map((s) => s.trim());

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* thumbnail */}
      <a
        href={watchHref}
        target={course.videoUrl ? "_blank" : undefined}
        rel={course.videoUrl ? "noreferrer" : undefined}
        className="relative block aspect-video overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${course.accent[0]}, ${course.accent[1]})` }}
      >
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Mandala className="absolute inset-0 m-auto h-4/5 w-4/5 text-white/10" />
        )}
        {course.badge && (
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider shadow-sm ${badgeTone}`}
          >
            {course.badge}
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <span className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${levelTone}`}>
          {course.level}
        </span>
        <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-ink">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/65">{course.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-ink/55">
          {lessonsPart && (
            <span className="inline-flex items-center gap-1.5">
              <LessonsIcon className="h-3.5 w-3.5 text-gold-500" /> {lessonsPart}
            </span>
          )}
          {durationPart && (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-gold-500" /> {durationPart}
            </span>
          )}
          {typeof course.rating === "number" && (
            <span className="inline-flex items-center gap-1 text-ink/70">
              <StarFillIcon className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-bold">{course.rating.toFixed(1)}</span>
              {typeof course.reviewCount === "number" && <span>({course.reviewCount})</span>}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="flex items-baseline gap-2">
            {course.price && <span className="font-serif text-xl font-bold text-ink">{course.price}</span>}
            {course.originalPrice && (
              <span className="text-sm text-ink/40 line-through">{course.originalPrice}</span>
            )}
          </span>
          <a
            href={watchHref}
            target={course.videoUrl ? "_blank" : undefined}
            rel={course.videoUrl ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-lg border border-gold-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-700 transition-colors hover:bg-gold-gradient hover:text-night hover:shadow-gold-btn"
          >
            {course.videoUrl ? "Watch Now" : "Enroll Now"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

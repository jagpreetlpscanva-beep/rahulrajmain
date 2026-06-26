import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  useCollection,
  DEFAULT_COURSES,
  COURSE_CATEGORIES,
  type Course,
  type CourseCategory,
} from "@/lib/adminStore";
import { Mandala } from "../ui/Mandala";

/* ─── Mock ratings (extend Course type in cms.ts if you want admin control) ─── */
const MOCK_RATINGS: Record<string, { score: number; count: number }> = {
  "course-vedic-foundation":   { score: 4.8, count: 128 },
  "course-predictive":         { score: 4.9, count: 86  },
  "course-kp-advanced":        { score: 4.8, count: 74  },
  "course-remedies":           { score: 4.7, count: 61  },
  "course-numerology-basics":  { score: 4.7, count: 54  },
  "course-name-numerology":    { score: 4.6, count: 41  },
  "course-vastu-home":         { score: 4.8, count: 73  },
  "course-vastu-shastra":      { score: 4.6, count: 52  },
  "course-vastu-business":     { score: 4.7, count: 38  },
  "course-palmistry-essentials":{ score: 4.7, count: 64 },
  "course-palmistry-advanced": { score: 4.6, count: 52  },
  "course-mantra-meditation":  { score: 4.9, count: 47  },
  "course-chakra-healing":     { score: 4.8, count: 39  },
};
const DEFAULT_RATING = { score: 4.7, count: 20 };

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "text-emerald-700 bg-emerald-50  border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50    border-amber-200",
  Advanced:     "text-blue-700    bg-blue-50     border-blue-200",
  Spiritual:    "text-purple-700  bg-purple-50   border-purple-200",
  "All levels": "text-pink-700    bg-pink-50     border-pink-200",
};

const FEATURES = [
  "Certificate Included",
  "Lifetime Access",
  "Downloadable Resources",
  "Mobile Friendly",
];

type SortOption = "Newest First" | "Price: Low to High" | "Price: High to Low" | "Top Rated";

function parsePriceNum(price: string) {
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

/* ─── Category icons ─── */
function CatIcon({ cat }: { cat: string }) {
  if (cat === "Astrology")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M6.34 17.66l-1.41 1.41" />
      </svg>
    );
  if (cat === "Numerology")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  if (cat === "Vastu")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  if (cat === "Palmistry")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0v2M10 10.5V6a2 2 0 00-4 0v8" />
        <path d="M6 14a2 2 0 012-2h8a2 2 0 012 2v3a5 5 0 01-10 0v-1z" />
      </svg>
    );
  if (cat === "Spiritual")
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    );
  return null;
}

/* ══════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════ */
export function CoursesGrid() {
  const { items } = useCollection<Course>("courses", DEFAULT_COURSES);

  const [activeCategory, setActiveCategory] = useState<CourseCategory | "All">("All");
  const [pendingMax, setPendingMax] = useState(5499);
  const [appliedMax, setAppliedMax] = useState(5499);
  const [levels, setLevels] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("Newest First");

  /* category counts */
  const catCounts = useMemo(() => {
    const m: Record<string, number> = { All: items.length };
    COURSE_CATEGORIES.forEach((c) => { m[c] = items.filter((x) => x.category === c).length; });
    return m;
  }, [items]);

  /* filtered + sorted list */
  const visible = useMemo(() => {
    let r = items.filter((c) => {
      if (activeCategory !== "All" && c.category !== activeCategory) return false;
      if (parsePriceNum(c.price) > appliedMax) return false;
      if (levels.length > 0 && !levels.includes(c.level)) return false;
      return true;
    });
    if (sort === "Price: Low to High")  r = [...r].sort((a, b) => parsePriceNum(a.price) - parsePriceNum(b.price));
    if (sort === "Price: High to Low")  r = [...r].sort((a, b) => parsePriceNum(b.price) - parsePriceNum(a.price));
    if (sort === "Top Rated")           r = [...r].sort((a, b) => (MOCK_RATINGS[b.id]?.score ?? 4.5) - (MOCK_RATINGS[a.id]?.score ?? 4.5));
    return r;
  }, [items, activeCategory, appliedMax, levels, sort]);

  const toggleLevel   = (l: string) => setLevels((p)   => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const toggleFeature = (f: string) => setFeatures((p)  => p.includes(f) ? p.filter((x) => x !== f) : [...p, f]);

  return (
    <section id="courses-list" className="paper-bg relative py-10 lg:py-14">
      <div className="container-px">

        {/* ── Category tabs with icons ── */}
        <div className="mb-8 flex justify-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "border-gold-500 bg-white text-gold-600 shadow-md"
                  : "border-gold-500/20 bg-white/50 text-ink/50 hover:bg-white hover:text-ink/70"
              }`}
            >
              <CatIcon cat={cat} />
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* ── Sidebar ── */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="rounded-xl border border-gold-500/20 bg-white/90 p-5 shadow-sm">

              {/* Categories */}
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-ink/40">Categories</p>
              <ul className="space-y-2.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveCategory("All")}
                    className={`flex w-full items-center justify-between text-sm font-medium ${
                      activeCategory === "All" ? "text-gold-600" : "text-ink/65 hover:text-ink"
                    }`}
                  >
                    <span>All Courses</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      activeCategory === "All" ? "bg-gold-100 text-gold-700" : "bg-ink/[0.06] text-ink/50"
                    }`}>
                      {catCounts.All}
                    </span>
                  </button>
                </li>
                {COURSE_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`flex w-full items-center justify-between text-sm ${
                        activeCategory === cat ? "font-semibold text-gold-600" : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        activeCategory === cat ? "bg-gold-100 text-gold-700" : "bg-ink/[0.06] text-ink/50"
                      }`}>
                        {catCounts[cat] ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Range */}
              <p className="mb-2 mt-6 text-[0.65rem] font-bold uppercase tracking-widest text-ink/40">Price Range</p>
              <input
                type="range"
                min={499} max={5499} step={100}
                value={pendingMax}
                onChange={(e) => setPendingMax(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="mt-1 flex justify-between text-xs text-ink/55">
                <span>₹499</span>
                <span>₹{pendingMax.toLocaleString("en-IN")}</span>
              </div>
              <button
                type="button"
                onClick={() => setAppliedMax(pendingMax)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold-gradient py-2 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <line x1="2" y1="5" x2="14" y2="5" /><line x1="4" y1="9" x2="12" y2="9" /><line x1="6" y1="13" x2="10" y2="13" />
                </svg>
                Apply Filter
              </button>

              {/* Level */}
              <p className="mb-2 mt-6 text-[0.65rem] font-bold uppercase tracking-widest text-ink/40">Level</p>
              <div className="space-y-2">
                {["Beginner", "Intermediate", "Advanced"].map((lv) => (
                  <label key={lv} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70 hover:text-ink">
                    <input
                      type="checkbox"
                      checked={levels.includes(lv)}
                      onChange={() => toggleLevel(lv)}
                      className="h-4 w-4 rounded border-gray-300 accent-gold-500"
                    />
                    {lv}
                  </label>
                ))}
              </div>

              {/* Features */}
              <p className="mb-2 mt-6 text-[0.65rem] font-bold uppercase tracking-widest text-ink/40">Features</p>
              <div className="space-y-2">
                {FEATURES.map((f) => (
                  <label key={f} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70 hover:text-ink">
                    <input
                      type="checkbox"
                      checked={features.includes(f)}
                      onChange={() => toggleFeature(f)}
                      className="h-4 w-4 rounded border-gray-300 accent-gold-500"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main area ── */}
          <div className="min-w-0 flex-1">
            {/* Sort bar */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-ink/60">
                Showing <span className="font-semibold text-ink">{visible.length}</span> results
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="rounded-lg border border-gold-500/30 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                {(["Newest First", "Price: Low to High", "Price: High to Low", "Top Rated"] as SortOption[]).map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            {visible.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {visible.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-ink/40">No courses match your filters.</p>
                <button
                  type="button"
                  onClick={() => { setActiveCategory("All"); setAppliedMax(5499); setPendingMax(5499); setLevels([]); }}
                  className="mt-4 text-sm font-medium text-gold-600 underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-gold-500/20 pt-10 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: "🕐", title: "Lifetime Access",   sub: "Learn at your own pace" },
            { icon: "🏆", title: "Certificate",       sub: "Upon Completion"         },
            { icon: "👨‍🏫", title: "Expert Guidance",  sub: "From Rahul Raj"          },
            { icon: "📱", title: "Mobile Friendly",   sub: "Study Anywhere"          },
            { icon: "🔒", title: "Secure Payment",    sub: "100% Safe & Secure"      },
            { icon: "💬", title: "24/7 Support",      sub: "We're Here to Help"      },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 text-2xl leading-none">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs text-ink/55">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   COURSE CARD
══════════════════════════════════════════════════ */
function CourseCard({ course }: { course: Course }) {
  const href = course.videoUrl || `/book/course/${course.id}`;
  const rating = MOCK_RATINGS[course.id] ?? DEFAULT_RATING;
  const levelCls = LEVEL_COLORS[course.level] ?? "text-ink/60 bg-ink/5 border-ink/15";
  const [lessonsPart, hoursPart] = course.lessons.split("·").map((s) => s.trim());

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* Thumbnail */}
      <a
        href={href}
        target={course.videoUrl ? "_blank" : undefined}
        rel={course.videoUrl ? "noreferrer" : undefined}
        className="relative block aspect-video overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${course.accent[0]}, ${course.accent[1]})` }}
      >
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <Mandala className="absolute inset-0 m-auto h-4/5 w-4/5 text-white/10" />
        )}

        {/* Badge */}
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white shadow">
            {course.badge}
          </span>
        )}

        {/* Play button */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>

      <div className="flex flex-1 flex-col p-4">
        {/* Level badge */}
        <span className={`self-start rounded border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${levelCls}`}>
          {course.level}
        </span>

        <h3 className="mt-2 font-serif text-[0.9rem] font-bold leading-snug text-ink">
          {course.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/60">
          {course.description}
        </p>

        {/* Meta row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.7rem] text-ink/50">
          {lessonsPart && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5 8h6M5 5.5h6M5 10.5h4" />
              </svg>
              {lessonsPart}
            </span>
          )}
          {hoursPart && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 1.5" />
              </svg>
              {hoursPart}
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <svg viewBox="0 0 16 16" className="h-3 w-3 text-amber-400" fill="currentColor" aria-hidden>
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" />
            </svg>
            <span className="font-semibold text-ink">{rating.score.toFixed(1)}</span>
            <span className="text-ink/40">({rating.count})</span>
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-serif text-lg font-bold text-[#c0392b]">{course.price}</span>
          <a
            href={href}
            target={course.videoUrl ? "_blank" : undefined}
            rel={course.videoUrl ? "noreferrer" : undefined}
            className="inline-flex shrink-0 items-center rounded-lg border border-gold-500/50 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-700 transition-all hover:border-gold-500 hover:bg-gold-50"
          >
            {course.videoUrl ? "Watch Now" : "Enroll Now"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

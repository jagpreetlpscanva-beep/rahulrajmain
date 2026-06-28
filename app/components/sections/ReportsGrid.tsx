"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCollection, DEFAULT_REPORTS, type StoredReport } from "@/lib/adminStore";
import { REPORT_CATEGORIES, type ReportCategory } from "@/lib/content";
import { Mandala } from "../ui/Mandala";

/* ---------------------------------------------------------------------- */
/*  Local icons                                                           */
/* ---------------------------------------------------------------------- */

type IconProps = { className?: string };

const ArrowIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ShieldIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const LockIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
);
const ClockIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const HeartIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.3-9.2-8.4C1.3 8.7 2.8 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.2 0 4.7 3.2 3.2 6.1C19 15.7 12 20 12 20Z" />
  </svg>
);
const BookIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4.5h9A2.5 2.5 0 0 1 16.5 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" />
    <path d="M16.5 7H19v12.5h-2.5M8.5 8.5h4.5M8.5 11.5h4.5" />
  </svg>
);

const TRUST = [
  { icon: ShieldIcon, t: "100% Accurate Reports", s: "Prepared by expert astrologers" },
  { icon: LockIcon, t: "Private & Secure", s: "Your information is always safe" },
  { icon: ClockIcon, t: "Fast Delivery", s: "Delivered to your email quickly" },
  { icon: HeartIcon, t: "Trusted by Thousands", s: "Loved by 5,000+ happy clients" },
];

/* ---------------------------------------------------------------------- */

export function ReportsGrid() {
  const { items: reports } = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  const [tab, setTab] = useState<ReportCategory>("All");

  // Backfill the new fields (category, sale pricing, badges) from defaults for
  // older stored records, while preserving any admin-uploaded cover image/title.
  const merged = useMemo(
    () =>
      reports.map((r) => {
        const def = DEFAULT_REPORTS.find((d) => d.id === r.id);
        if (!def) return r;
        return {
          ...def,
          image: r.image || def.image,
          title: r.title || def.title,
          description: r.description || def.description,
        };
      }),
    [reports]
  );

  const visible = useMemo(
    () => (tab === "All" ? merged : merged.filter((r) => r.category === tab)),
    [merged, tab]
  );

  return (
    <section className="relative pb-20 lg:pb-24">
      <div className="container-px">
        {/* category tabs */}
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          {REPORT_CATEGORIES.map((cat) => {
            const active = tab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setTab(cat)}
                className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                  active
                    ? "bg-gold-gradient text-night shadow-gold-btn"
                    : "border border-gold-500/25 bg-white text-ink/65 hover:border-gold-500/50 hover:text-ink"
                }`}
              >
                {cat === "All" ? "All Reports" : cat}
              </button>
            );
          })}
        </div>

        {/* cards */}
        {visible.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {visible.map((report, i) => (
              <ReportCard key={report.id} report={report} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-ink/55">No reports in this category yet.</p>
        )}

        {/* trust section */}
        <div className="mt-16 grid gap-6 rounded-3xl border border-gold-500/15 bg-white/80 p-8 shadow-[0_20px_60px_-30px_rgba(120,80,20,0.4)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:p-10">
          {TRUST.map((item) => (
            <div key={item.t} className="flex flex-col items-center gap-3 text-center lg:px-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">
                <item.icon className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{item.t}</p>
                <p className="mt-0.5 text-xs text-ink/55">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportCard({ report, index }: { report: StoredReport; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold-500/15 bg-white shadow-[0_14px_40px_-24px_rgba(120,80,20,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(120,80,20,0.55)]"
    >
      {/* cover */}
      <div
        className="relative aspect-[5/4] overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${report.accent[0]}, ${report.accent[1]})` }}
      >
        {report.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-gold-700 shadow-sm">
            {report.badge}
          </span>
        )}

        {report.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={report.image} alt={report.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-cream">
            <Mandala className="absolute inset-0 m-auto h-3/4 w-3/4 text-white/10" />
            <div className="relative flex flex-col items-center gap-2 px-6 text-center">
              <BookIcon className="h-10 w-10 text-cream/90" />
              <span className="font-serif text-lg font-bold leading-tight">{report.title}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/70">{report.tagline}</span>
            </div>
          </div>
        )}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <h3 className="font-serif text-lg font-bold leading-snug text-ink">{report.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">{report.description}</p>

        {/* price */}
        <div className="mt-4 flex items-baseline gap-2">
          {report.oldPrice && (
            <span className="text-sm text-ink/40 line-through">{report.oldPrice}</span>
          )}
          {report.price && (
            <span className="font-serif text-2xl font-bold text-ink">{report.price}</span>
          )}
        </div>

        {/* CTA */}
        <a
          href={`/book/report/${report.id}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-gold-500/40 bg-gold-50/50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gold-700 transition-all duration-300 hover:bg-gold-gradient hover:text-night hover:shadow-gold-btn"
        >
          View Details
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.article>
  );
}

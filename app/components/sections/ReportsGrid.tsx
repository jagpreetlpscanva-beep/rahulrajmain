"use client";

import { motion } from "framer-motion";
import { useCollection, DEFAULT_REPORTS, type StoredReport } from "@/lib/adminStore";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { CrestDivider, LotusDivider } from "../ui/Dividers";
import { Mandala } from "../ui/Mandala";
import { Button } from "../ui/Button";
import { ArrowRightIcon, CalendarIcon, GiftIcon } from "../icons";

export function ReportsGrid() {
  const { items: reports } = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  return (
    <section className="paper-bg relative py-20 lg:py-24">
      <div className="container-px">
        <Reveal className="flex flex-col items-center text-center">
          <CrestDivider className="mb-8" />
          <span className="eyebrow text-gold-600">Personalized Vedic Reports</span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">
            Reports Crafted For Your Chart
          </h2>
          <LotusDivider className="my-6" />
          <p className="max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Each report is hand-prepared from your birth details — clear, practical
            guidance you can act on with confidence.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <RevealItem key={report.id}>
              <ReportCard report={report} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 flex justify-center" delay={0.1}>
          <Button href="/#contact" icon={<CalendarIcon className="h-5 w-5" />}>
            Not sure which report? Book a Consultation
            <ArrowRightIcon className="ml-1 h-5 w-5" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function ReportCard({ report }: { report: StoredReport }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold-500/20 bg-white/70 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* cover — shows the report image when provided, else an elegant placeholder */}
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${report.accent[0]}, ${report.accent[1]})` }}
      >
        {report.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-md bg-gold-gradient px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-night shadow-sm">
            {report.badge}
          </span>
        )}

        {report.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={report.image} alt={report.title} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-cream">
            <Mandala className="absolute inset-0 m-auto h-3/4 w-3/4 text-white/10" />
            <div className="relative flex flex-col items-center gap-3 px-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <GiftIcon className="h-8 w-8 text-cream" />
              </span>
              <span className="font-serif text-2xl font-bold leading-tight">{report.title}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-cream/70">
                {report.tagline}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold leading-snug text-ink">{report.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{report.description}</p>

        <ul className="mt-4 space-y-2">
          {report.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 text-sm text-ink/75">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-gold-500/15 pt-5">
          {report.price && (
            <span className="font-serif text-2xl font-bold text-ink">{report.price}</span>
          )}
          <a
            href={`/book/report/${report.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
          >
            Get Report
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

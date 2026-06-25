"use client";

import { useCollection, DEFAULT_REPORTS, DEFAULT_COURSES, type StoredReport, type Course } from "@/lib/adminStore";
import { TOOLS, optimizeImage } from "@/lib/content";
import { Icon, ArrowRightIcon, WhatsAppIcon } from "../icons";
import { Mandala } from "../ui/Mandala";
import { ZodiacWheel } from "../ui/ZodiacWheel";
import { LotusDivider, Diamond } from "../ui/Dividers";
import type { IconName } from "@/lib/content";

const REPORT_ICONS: IconName[] = ["briefcase", "couple", "lotus-person", "wealth", "star", "numerology"];
const COURSE_GRADIENTS = ["from-[#3B5BA9] to-[#1E2F66]", "from-[#6B3FA0] to-[#36205C]", "from-[#1F7A6B] to-[#0C3B34]"];
const ICON_GLOW = "shadow-[0_8px_22px_-6px_rgba(192,138,46,0.7)]";

const TRUST = [
  { icon: "shield" as IconName, title: "100% Confidential", body: "Your privacy is our top priority." },
  { icon: "star" as IconName, title: "Accurate & Reliable", body: "Insights you can trust and act on." },
  { icon: "lotus-person" as IconName, title: "Personalized Guidance", body: "Solutions tailored to your chart." },
  { icon: "magnet" as IconName, title: "Timely Remedies", body: "Effective remedies for a better tomorrow." },
  { icon: "users" as IconName, title: "Expert Support", body: "We're here to help you always." },
];

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-gold-600 ${center ? "justify-center" : ""}`}>
      <Diamond className="h-2 w-2" />
      <span className="eyebrow">{children}</span>
      <Diamond className="h-2 w-2" />
    </span>
  );
}

export function ExploreSection() {
  const { items: reports } = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  const { items: courses } = useCollection<Course>("courses", DEFAULT_COURSES);

  return (
    <section className="relative overflow-hidden bg-[#faf4e8] py-16 lg:py-24">
      <div className="amber-radial pointer-events-none absolute inset-0 opacity-40" />
      <Mandala className="pointer-events-none absolute -left-24 top-10 h-72 w-72 text-gold-600/[0.07]" />
      <Mandala className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 text-gold-600/[0.07]" />

      <div className="container-wide relative">
        <div className="mx-auto grid max-w-[1500px] items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ---------- left: reports ---------- */}
          <div className="rounded-3xl border-2 border-gold-500/30 bg-white p-6 shadow-card">
            <Eyebrow>Personalized Vedic Reports</Eyebrow>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">
              Reports Crafted For Your Chart
            </h2>
            <p className="mt-1 text-sm text-ink/55">Detailed • Accurate • Personalized</p>
            <LotusDivider className="mt-4" />

            <div className="mt-5 space-y-3">
              {reports.slice(0, 3).map((r, i) => (
                <a
                  key={r.id}
                  href="/reports"
                  className="group flex items-start gap-3 rounded-2xl border border-gold-500/15 bg-[#fbf7ee] p-3.5 transition-all hover:-translate-y-0.5 hover:border-gold-500/45 hover:shadow-card"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white ${ICON_GLOW}`}
                    style={{ background: `linear-gradient(150deg, ${r.accent?.[0] ?? "#C08A2E"}, ${r.accent?.[1] ?? "#7A5212"})` }}
                  >
                    <Icon name={REPORT_ICONS[i % REPORT_ICONS.length]} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ink">{r.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink/55">{r.description}</p>
                  </div>
                </a>
              ))}
            </div>

            <a href="/reports" className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-gold-500/30 px-4 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:bg-gold-50">
              Explore All Reports <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          {/* ---------- middle: astrology tools ---------- */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-gold-500/45 bg-gradient-to-b from-white to-gold-50/60 p-6 shadow-card-hover">
            <ZodiacWheel className="pointer-events-none absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 animate-spin-slower text-gold-600/[0.06]" />
            <div className="relative text-center">
              <Eyebrow center>Free Astrology Tools</Eyebrow>
              <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">
                Powerful Tools For Life&rsquo;s Answers
              </h2>
              <p className="mt-1 text-sm text-ink/55">Accurate calculations. 100% free.</p>
              <LotusDivider className="mx-auto mt-4" />

              <div className="mt-5 space-y-2.5 text-left">
                {TOOLS.map((tool) => (
                  <a
                    key={tool.title}
                    href="#contact"
                    className="group flex items-center gap-3 rounded-xl border border-gold-500/15 bg-white/80 p-3 transition-all hover:-translate-y-0.5 hover:border-gold-500/45 hover:shadow-card"
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-cream ${ICON_GLOW}`}>
                      <Icon name={tool.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 font-serif text-sm font-bold text-ink">{tool.title}</span>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>

              {/* quote */}
              <div className="mt-5 rounded-2xl border border-gold-500/20 bg-gold-50/70 p-4">
                <p className="text-sm italic leading-relaxed text-ink/70">
                  &ldquo;These tools are designed to bring clarity to your life&rsquo;s questions and help you make empowered decisions.&rdquo;
                </p>
                <p className="mt-2 font-serif text-sm font-bold text-gold-700">— Astro Rahul Raj</p>
              </div>
            </div>
          </div>

          {/* ---------- right: courses ---------- */}
          <div className="rounded-3xl border-2 border-gold-500/30 bg-white p-6 shadow-card">
            <Eyebrow>Learn With Rahul Raj</Eyebrow>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">
              Courses &amp; Masterclasses
            </h2>
            <p className="mt-1 text-sm text-ink/55">Learn anytime. Grow every day.</p>
            <LotusDivider className="mt-4" />

            <div className="mt-5 space-y-4">
              {courses.slice(0, 2).map((c, i) => (
                <a
                  key={c.id}
                  href="/courses"
                  className="relative block overflow-hidden rounded-2xl text-white shadow-card transition-transform hover:-translate-y-0.5"
                >
                  {c.thumbnail ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={optimizeImage(c.thumbnail, 700)} alt={c.title} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
                    </>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${COURSE_GRADIENTS[i % COURSE_GRADIENTS.length]}`} />
                  )}
                  <ZodiacWheel className="pointer-events-none absolute -left-6 top-1/2 h-32 w-32 -translate-y-1/2 text-white/10" />

                  {i === 0 && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-luxe-gold px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-espresso">
                      Bestseller
                    </span>
                  )}

                  <div className="relative flex min-h-[8.5rem] flex-col justify-end p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/90 text-night shadow-lg">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-lg font-bold leading-tight">{c.title}</p>
                        <p className="text-xs text-white/75">{c.level}</p>
                      </div>
                      {c.price && <span className="shrink-0 font-serif text-xl font-bold">{c.price}</span>}
                    </div>
                    {c.lessons && <p className="mt-2 text-xs text-white/75">{c.lessons}</p>}
                  </div>
                </a>
              ))}
            </div>

            <a href="/courses" className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-gold-500/30 px-4 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:bg-gold-50">
              View All Courses <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ---------- trust badges ---------- */}
        <div className="mx-auto mt-10 grid max-w-[1500px] gap-5 rounded-2xl border-2 border-gold-500/25 bg-white p-6 shadow-card sm:grid-cols-3 lg:grid-cols-5">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient text-cream ${ICON_GLOW}`}>
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-ink">{t.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{t.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- WhatsApp CTA ---------- */}
        <div className="mx-auto mt-6 flex max-w-[1500px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gold-500/30 bg-gradient-to-r from-white to-gold-50/60 p-5 text-center shadow-card sm:flex-row">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <p className="text-ink">
            <strong>Still have questions?</strong> Chat directly with Rahul Ji on WhatsApp
          </p>
          <a
            href="https://wa.me/919415312590"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
          >
            Chat Now <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

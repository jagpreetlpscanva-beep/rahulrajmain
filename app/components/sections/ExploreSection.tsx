"use client";

import { useState, type FormEvent } from "react";
import { useCollection, DEFAULT_REPORTS, DEFAULT_COURSES, type StoredReport, type Course } from "@/lib/adminStore";
import { TOOLS } from "@/lib/content";
import { Icon, ArrowRightIcon } from "../icons";
import { Mandala } from "../ui/Mandala";
import { LotusDivider } from "../ui/Dividers";
import type { IconName } from "@/lib/content";

const REPORT_ICONS: IconName[] = ["briefcase", "couple", "lotus-person", "wealth", "star", "numerology"];
const COURSE_GRADIENTS = ["from-[#3B5BA9] to-[#1E2F66]", "from-[#6B3FA0] to-[#36205C]", "from-[#1F7A6B] to-[#0C3B34]"];

const TOOL_SUBTITLES: Record<string, string> = {
  "Free Birth Chart": "Instant Janam Kundli",
  "Compatibility Calculator": "Check Relationship Compatibility",
  "Numerology Calculator": "Reveal Your Numbers",
  "Lucky Number Finder": "Find Your Lucky Numbers",
  "Name Analysis": "Analyze Your Name",
  "Moon Sign Finder": "Discover Your Moon Sign",
};

const TRUST = [
  { icon: <TargetSvg />, title: "100% Accurate", body: "Vedic calculations you can trust" },
  { icon: <ShieldSvg />, title: "Trusted by Thousands", body: "Real guidance. Real results." },
  { icon: <LockSvg />, title: "100% Secure", body: "Your data is safe with us" },
  { icon: <HeadsetSvg />, title: "Expert Support", body: "We're here to help you" },
];

const ICON_GLOW = "shadow-[0_8px_22px_-6px_rgba(192,138,46,0.7)]";

function ColHeader({ icon, title, sub }: { icon: React.ReactNode; title: React.ReactNode; sub: string }) {
  return (
    <div className="text-center">
      <span className={`mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-gold-500/40 text-gold-600 ${ICON_GLOW}`}>{icon}</span>
      <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink sm:text-[1.7rem]">{title}</h2>
      <p className="mt-1.5 text-sm font-semibold tracking-wide text-gold-700">{sub}</p>
      <LotusDivider className="mx-auto mt-3" />
    </div>
  );
}

export function ExploreSection() {
  const { items: reports } = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  const { items: courses } = useCollection<Course>("courses", DEFAULT_COURSES);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf4e8] py-16 lg:py-24">
      <div className="amber-radial pointer-events-none absolute inset-0 opacity-40" />
      <Mandala className="pointer-events-none absolute -left-24 top-10 h-72 w-72 text-gold-600/[0.07]" />
      <Mandala className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 text-gold-600/[0.07]" />

      <div className="container-wide relative">
        <div className="mx-auto grid max-w-[1500px] items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ---------- reports ---------- */}
          <div className="flex flex-col rounded-3xl border-2 border-gold-500/25 bg-white p-6 shadow-card sm:p-7">
            <ColHeader icon={<DocSvg />} title={<>Personalized Reports<br />That Guide You</>} sub="Accurate • In-Depth • Actionable" />
            <div className="mt-5 flex flex-1 flex-col gap-3">
              {reports.slice(0, 3).map((r, i) => (
                <div key={r.id} className="flex flex-1 items-center gap-3.5 rounded-2xl border border-gold-500/15 bg-[#fbf7ee] p-4">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image} alt={r.title} className={`h-14 w-14 shrink-0 rounded-full object-cover ${ICON_GLOW}`} />
                  ) : (
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-white ${ICON_GLOW}`} style={{ background: `linear-gradient(150deg, ${r.accent?.[0] ?? "#C08A2E"}, ${r.accent?.[1] ?? "#7A5212"})` }}>
                      <Icon name={REPORT_ICONS[i % REPORT_ICONS.length]} className="h-7 w-7" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-serif text-lg font-bold leading-tight text-ink">{r.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink/55">{r.description}</p>
                    <a href="/reports" className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-gold-700">Explore Report <ArrowRightIcon className="h-3.5 w-3.5" /></a>
                  </div>
                </div>
              ))}
            </div>
            <a href="/reports" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-night px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5">
              ⊞ View All Reports <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          {/* ---------- tools ---------- */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-gold-500/40 bg-white p-6 shadow-card-hover sm:p-7">
            <ColHeader icon={<StarSvg />} title={<>Powerful Tools For<br />Life&rsquo;s Answers</>} sub="100% Accurate • Free • Instant Results" />
            <div className="mt-5 flex flex-1 flex-col gap-2.5">
              {TOOLS.map((tool) => (
                <a key={tool.title} href="#contact" className="group flex items-center gap-3 rounded-xl border border-gold-500/15 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-500/45 hover:shadow-card">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient text-cream ${ICON_GLOW}`}>
                    <Icon name={tool.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-base font-bold leading-tight text-ink">{tool.title}</span>
                    <span className="block text-xs text-ink/50">{TOOL_SUBTITLES[tool.title] ?? "Free tool"}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
            <a href="#contact" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
              Explore All Tools <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          {/* ---------- courses ---------- */}
          <div className="flex flex-col rounded-3xl border-2 border-gold-500/25 bg-white p-6 shadow-card sm:p-7">
            <ColHeader icon={<CapSvg />} title={<>Courses &amp;<br />Masterclasses</>} sub="Learn • Understand • Transform" />
            <div className="mt-5 flex flex-1 flex-col gap-4">
              {courses.slice(0, 2).map((c, i) => (
                <a key={c.id} href="/courses" className="relative flex-1 overflow-hidden rounded-2xl text-white shadow-card transition-transform hover:-translate-y-0.5">
                  {c.thumbnail ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.thumbnail} alt={c.title} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                    </>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${COURSE_GRADIENTS[i % COURSE_GRADIENTS.length]}`} />
                  )}
                  {i === 0 && <span className="absolute right-3 top-3 z-10 rounded-full bg-luxe-gold px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-espresso">Bestseller</span>}
                  <div className="relative flex min-h-[9rem] flex-col justify-end p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/90 text-night shadow-lg">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
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
            <a href="/courses" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-night px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5">
              View All Courses <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ---------- gold trust bar ---------- */}
        <div className="mx-auto mt-8 grid max-w-[1500px] gap-5 rounded-2xl bg-gradient-to-r from-[#C9962F] via-[#E2B651] to-[#C9962F] p-6 text-night shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/25 text-night">{t.icon}</span>
              <div>
                <p className="text-sm font-bold leading-tight">{t.title}</p>
                <p className="text-xs text-night/70">{t.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- free birth chart email capture ---------- */}
        <div className="mx-auto mt-5 flex max-w-[1500px] flex-col items-center justify-between gap-4 rounded-2xl border-2 border-gold-500/30 bg-white p-5 shadow-card lg:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient text-night"><GiftSvg /></span>
            <div>
              <p className="font-serif text-lg font-bold text-ink">New Here? Get FREE Birth Chart Instantly!</p>
              <p className="text-sm text-ink/55">Discover your Kundli and start your journey today.</p>
            </div>
          </div>
          {sent ? (
            <p className="font-semibold text-emerald-700">Thank you! We&rsquo;ll be in touch 🙏</p>
          ) : (
            <form onSubmit={submitEmail} className="flex w-full max-w-md gap-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none focus:border-gold-500" />
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-bold text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                Get Free Now <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- inline icons ---------------- */
function DocSvg() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>;
}
function StarSvg() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" /></svg>;
}
function CapSvg() {
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>;
}
function TargetSvg() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>;
}
function ShieldSvg() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M9 12l2 2 4-4" /></svg>;
}
function LockSvg() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
}
function HeadsetSvg() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Zm0 2v1a4 4 0 0 1-4 4h-4" /></svg>;
}
function GiftSvg() {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8C12 6 10.5 4 8.5 4S5 5 5 6.5 6.5 8 8.5 8H12Zm0 0c0-2 1.5-4 3.5-4S19 5 19 6.5 17.5 8 15.5 8H12Z" /></svg>;
}

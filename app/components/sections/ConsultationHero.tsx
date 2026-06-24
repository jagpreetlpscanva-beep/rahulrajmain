"use client";

import { useCollection, DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/adminStore";
import { ZodiacWheel } from "../ui/ZodiacWheel";
import { WhatsAppIcon, CalendarIcon } from "../icons";

const WHATSAPP_HREF = "https://wa.me/919415312590";
const BOOK_HREF = "/book/consultation/quick";

const STATS = [
  { value: "4.9/5", label: "Rating", icon: <StarSvg /> },
  { value: "40,000+", label: "Consultations", icon: <UsersSvg /> },
  { value: "15+", label: "Years Experience", icon: <TrophySvg /> },
  { value: "100,000+", label: "People Helped", icon: <GlobeSvg /> },
];

const FEATURES = [
  { title: "Accurate Predictions", body: "Based on Vedic Scriptures", icon: <TargetSvg /> },
  { title: "Personalized Guidance", body: "Solutions for your unique life", icon: <PersonSvg /> },
  { title: "Right Timing", body: "Make the right moves", icon: <ClockSvg /> },
  { title: "Talk on WhatsApp or Chat", body: "Your convenience, your choice", icon: <ChatSvg /> },
  { title: "100% Confidential", body: "Your privacy is our priority", icon: <LockSvg /> },
];

export function ConsultationHero() {
  const { items: slides } = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);
  const astro =
    slides.find((s) => s.visual === "astrologer" && s.image)?.image ||
    slides.find((s) => s.image)?.image ||
    "/hero-astrologer.png";

  return (
    <section className="relative overflow-hidden bg-sunset-orange pt-28 text-cream lg:pt-32">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_280px_80px_rgba(70,34,10,0.55)]" />
      <div className="pointer-events-none absolute right-[-4%] top-[6%] hidden h-[44rem] w-[44rem] animate-glow-breathe bg-amber-radial opacity-50 blur-2xl lg:block" />

      <div className="container-px relative">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* ---------- left ---------- */}
          <div className="relative z-10 pb-6 lg:pb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-luxe-gold/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-luxe-gold backdrop-blur-sm">
              <StarSvg className="h-3.5 w-3.5" /> 15+ Years of Trust &amp; Guidance
            </span>

            <h1 className="mt-5 font-serif text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
              <span className="text-white">Talk Directly With Rahul Raj —</span>
              <br />
              <span className="text-luxe-gold">Get Answers About Career, Marriage &amp; Money</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">
              Personalized Vedic consultation to help you make confident decisions and create a
              better tomorrow.
            </p>

            {/* stats */}
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-luxe-gold">{s.icon}</span>
                  <div>
                    <p className="font-serif text-lg font-bold leading-none text-white">{s.value}</p>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-cream/70">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* offer */}
            <div className="mt-7 flex max-w-md items-center justify-between gap-4 rounded-2xl border border-luxe-gold/25 bg-white/95 px-5 py-4 text-ink shadow-card">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Limited-Time Offer</p>
                <p className="mt-0.5 flex items-end gap-2">
                  <span className="text-lg text-ink/40 line-through">₹999</span>
                  <span className="font-serif text-3xl font-bold text-gold-700">₹499</span>
                </p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-3 py-2 text-center text-xs font-bold leading-tight text-emerald-700">
                50% OFF
                <br />
                <span className="font-medium">On Consultation</span>
              </span>
            </div>

            {/* buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={BOOK_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-luxe-gold px-6 py-4 font-serif text-base font-bold text-espresso shadow-luxe-btn transition-transform hover:-translate-y-0.5"
              >
                <CalendarIcon className="h-5 w-5" /> Book Consultation for ₹499 →
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream/40 px-6 py-4 text-base font-semibold text-cream transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>

            {/* trust line */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-cream/80">
              <span className="inline-flex items-center gap-1.5"><LockSvg className="h-4 w-4 text-luxe-gold" /> 100% Confidential</span>
              <span className="inline-flex items-center gap-1.5"><ShieldSvg className="h-4 w-4 text-luxe-gold" /> Secure Payments</span>
              <span className="inline-flex items-center gap-1.5"><UsersSvg className="h-4 w-4 text-luxe-gold" /> Trusted by 40,000+ Clients</span>
            </div>
          </div>

          {/* ---------- right: astrologer ---------- */}
          <div className="relative mx-auto aspect-square w-full max-w-[26rem] lg:mx-0 lg:ml-auto lg:max-w-[34rem]">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-ray-glow opacity-80" />
            <ZodiacWheel className="absolute inset-0 h-full w-full animate-spin-slower text-[#F7EAD0]/80" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={astro}
              alt="Astro Rahul Raj"
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="absolute bottom-0 left-1/2 h-[96%] -translate-x-1/2 object-contain drop-shadow-[0_30px_40px_rgba(40,20,5,0.45)]"
            />
            <div className="absolute bottom-[12%] right-[-2%] flex items-center gap-2.5 rounded-xl border border-luxe-gold/30 bg-espresso/90 px-4 py-3 text-cream shadow-lg backdrop-blur-sm">
              <ShieldSvg className="h-6 w-6 text-luxe-gold" />
              <div>
                <p className="text-sm font-bold leading-tight">Authentic Vedic Guidance</p>
                <p className="text-[0.7rem] text-cream/70">Rooted in scriptures. Focused on you.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- feature row (overlapping card) ---------- */}
        <div className="relative z-10 mx-auto -mb-10 mt-4 grid max-w-6xl translate-y-10 grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-gold-500/20 bg-paper-bg p-6 shadow-card sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600">
                {f.icon}
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-ink">{f.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-16 bg-paper-bg" />
    </section>
  );
}

/* ---------------- inline icons ---------------- */
function StarSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" />
    </svg>
  );
}
function UsersSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function TrophySvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22v-3.5M14 22v-3.5M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
function GlobeSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}
function TargetSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function PersonSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}
function ClockSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function ChatSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
    </svg>
  );
}
function LockSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function ShieldSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}

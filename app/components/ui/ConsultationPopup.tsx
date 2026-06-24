"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCollection, DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/adminStore";
import { ZodiacWheel } from "./ZodiacWheel";
import { CalendarIcon, CloseIcon, WhatsAppIcon } from "../icons";

const WHATSAPP_HREF = "https://wa.me/919415312590";
const BOOK_HREF = "/book/consultation/quick";

const BULLETS = [
  "Get clear answers on career, marriage, health & money",
  "Guided by 20+ years of authentic Vedic astrology",
  "100% confidential & secure",
  "Talk on WhatsApp or Chat – your choice",
];

const STATS = [
  { icon: <TrophySvg />, value: "20+ Years", label: "of Experience" },
  { icon: <ShieldSvg />, value: "Trusted by", label: "2,500+ Clients" },
  { icon: <StarSvg />, value: "4.9/5 Rating", label: "★★★★★" },
];

const TRUST = [
  { icon: <LockSvg />, title: "100% Confidential", body: "Your privacy is our priority" },
  { icon: <ChatSvg />, title: "Talk on WhatsApp or Chat", body: "Choose what's convenient for you" },
  { icon: <ClockSvg />, title: "Get Clarity, Take Control", body: "Right guidance, right timing" },
];

export function ConsultationPopup() {
  const [open, setOpen] = useState(false);
  const { items: slides } = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);
  const astro =
    slides.find((s) => s.visual === "astrologer" && s.image)?.image ||
    slides.find((s) => s.image)?.image ||
    "/hero-astrologer.png";

  useEffect(() => {
    if (sessionStorage.getItem("rr-consult-popup") === "1") return;
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem("rr-consult-popup", "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#faf4e8] p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/5 text-ink/60 transition-colors hover:bg-black/10 hover:text-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="grid gap-7 lg:grid-cols-2">
              {/* ---------- left ---------- */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-700">
                  ✦ Limited-Time Offer
                </span>
                <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-espresso">
                  <span className="border-b-4 border-gold-400">Talk</span> to Rahul Raj
                </h3>
                <p className="mt-1.5 text-sm text-ink/65">Personal 1-on-1 Vedic consultation</p>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-luxe-gold">★★★★★</span>
                  <span className="font-semibold text-ink">4.9/5</span>
                  <span className="text-ink/55">(2,500+ consultations)</span>
                </div>

                {/* price */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-white px-5 py-3 shadow-sm">
                  <span className="text-lg text-ink/40 line-through">₹999</span>
                  <span className="font-serif text-4xl font-bold text-gold-700">₹499</span>
                  <span className="ml-auto rounded-lg bg-emerald-100 px-3 py-1.5 text-center text-xs font-bold leading-tight text-emerald-700">
                    50% OFF<br /><span className="font-medium">Limited Time</span>
                  </span>
                </div>

                {/* bullets */}
                <ul className="mt-4 space-y-2.5">
                  {BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink/80">
                      <CheckSvg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {b}
                    </li>
                  ))}
                </ul>

                <a
                  href={BOOK_HREF}
                  onClick={close}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-4 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
                >
                  <CalendarIcon className="h-5 w-5" /> Book Now for ₹499
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <WhatsAppIcon className="h-4 w-4" /> or chat on WhatsApp
                </a>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/50">
                  <LockSvg className="h-3.5 w-3.5" /> Secure • Private • Trusted by 2,500+ people
                </p>
              </div>

              {/* ---------- right ---------- */}
              <div className="relative hidden lg:block">
                {/* photo on a faint zodiac circle */}
                <div className="relative z-10 mx-auto aspect-square max-w-[18rem]">
                  <ZodiacWheel className="absolute inset-0 m-auto h-[92%] w-[92%] text-gold-600/15" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={astro}
                    alt="Astro Rahul Raj"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="absolute bottom-0 left-1/2 h-[108%] -translate-x-1/2 object-contain drop-shadow-[0_20px_30px_rgba(40,20,5,0.35)]"
                  />
                </div>
                {/* green stats block, tucked under the photo */}
                <div className="relative -mt-8 rounded-2xl bg-[#173d22] p-5 text-cream">
                  {STATS.map((s, i) => (
                    <div key={i} className={`flex items-center gap-3 ${i > 0 ? "mt-3" : ""}`}>
                      <span className="text-luxe-gold">{s.icon}</span>
                      <div>
                        <p className="text-sm font-bold leading-tight">{s.value}</p>
                        <p className="text-xs text-cream/70">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------- trust badges ---------- */}
            <div className="mt-6 grid gap-4 rounded-2xl bg-gold-50/70 p-5 sm:grid-cols-3">
              {TRUST.map((t) => (
                <div key={t.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-gold-600">{t.icon}</span>
                  <div>
                    <p className="text-sm font-bold leading-tight text-ink">{t.title}</p>
                    <p className="text-xs text-ink/55">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-ink/60">
              👥 Join <strong className="text-ink">2,500+</strong> people who found clarity and direction with Rahul Raj
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- inline icons ---------------- */
function CheckSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function StarSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" />
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
function ShieldSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M9 12l2 2 4-4" />
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
function ChatSvg({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
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

import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { ContactForm } from "../components/sections/ContactForm";
import { ContactFaq } from "../components/sections/ContactFaq";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";
import { WhatsAppIcon } from "../components/icons";

export const metadata: Metadata = {
  title: "Contact — Rahul Raj Astro, Vedic Astrologer",
  description:
    "Get in touch with Rahul Raj Astro on WhatsApp, call or email for personal Vedic astrology consultations. We reply within a few hours.",
};

const PHONE = "+91 94153 12590";
const PHONE_TEL = "+919415312590";
const WHATSAPP = "https://wa.me/919415312590";
const EMAIL = "hello@rahulrajastrologer.com";

type IconProps = { className?: string };
const PhoneIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.9 2Z" /></svg>
);
const MailIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const ClockIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>
);

const CARDS = [
  { kind: "wa", Icon: WhatsAppIcon, title: "WhatsApp", main: PHONE, sub: "Chat instantly for quick answers and support", cta: "Chat Now", href: WHATSAPP, recommended: true },
  { kind: "call", Icon: PhoneIcon, title: "Call Us", main: PHONE, sub: "Speak directly with our astrology experts", cta: "Call Now", href: `tel:${PHONE_TEL}`, recommended: false },
  { kind: "mail", Icon: MailIcon, title: "Email Us", main: EMAIL, sub: "Drop us an email and we'll get back to you", cta: "Send Email", href: `mailto:${EMAIL}`, recommended: false },
  { kind: "hours", Icon: ClockIcon, title: "Office Hours", main: "Mon – Sat: 10 AM – 7:30 PM", sub: "Sunday: Closed · We're here during these hours", cta: "View Timings", href: "#contact-form", recommended: false },
] as const;

const TRUST = [
  { t: "Fast Response", s: "We respond within a few hours" },
  { t: "100% Private", s: "Your information is safe with us" },
  { t: "Trusted by Thousands", s: "Happy clients from around the world" },
  { t: "Expert Guidance", s: "Connect with experienced astrologers" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        {/* ---------------- hero ---------------- */}
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="container-px relative pb-10 text-center lg:pb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_LOGO_SRC} alt="Rahul Raj Astro" className="mx-auto h-20 w-20 select-none rounded-full object-cover shadow-[0_8px_30px_-8px_rgba(120,80,20,0.4)] ring-1 ring-gold-500/30 sm:h-24 sm:w-24" />
            <h1 className="mx-auto mt-5 max-w-3xl font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
              Let&rsquo;s Connect With <br className="hidden sm:block" />
              <span className="text-gold-600">Rahul Raj Astro</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              Have a question or want to book a consultation? We&rsquo;re here to help you on your journey.
            </p>
          </div>
        </section>

        {/* ---------------- contact cards ---------------- */}
        <section className="container-px">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <div key={c.title} className="relative flex flex-col items-center rounded-3xl border border-gold-500/15 bg-white p-6 text-center shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5">
                {c.recommended && (
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-emerald-700">★ Recommended</span>
                )}
                <span className={`grid h-14 w-14 place-items-center rounded-full ${c.kind === "wa" ? "bg-emerald-500 text-white" : "bg-gold-50 text-gold-600 ring-1 ring-gold-500/20"}`}>
                  <c.Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-1 break-words text-sm font-semibold text-gold-700">{c.main}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink/55">{c.sub}</p>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={`mt-5 w-full rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    c.kind === "wa"
                      ? "border-emerald-500/40 text-emerald-700 hover:bg-emerald-50"
                      : "border-gold-500/40 text-gold-700 hover:bg-gold-50"
                  }`}
                >
                  {c.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- guidance banner ---------------- */}
        <section className="container-px mt-12">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold-500/15 bg-gradient-to-r from-gold-50 to-[#FBF1D9] p-8 text-center md:flex-row md:text-left lg:p-10">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gold-gradient text-3xl text-night">🧘</div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-ink">Need Personal Guidance?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                Book a 1-on-1 consultation with Rahul Raj Astro and get clarity on your life&rsquo;s important questions.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href="/consultation" className="rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn transition-transform hover:-translate-y-0.5">
                Book Consultation →
              </a>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- form ---------------- */}
        <section id="contact-form" className="container-px mt-12 scroll-mt-28">
          <ContactForm />
        </section>

        {/* ---------------- trust strip ---------------- */}
        <section className="container-px mt-10">
          <div className="grid gap-6 rounded-3xl border border-gold-500/15 bg-white/70 p-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.t} className="flex flex-col items-center gap-2 text-center">
                <span className="h-2 w-2 rounded-full bg-gold-500" />
                <p className="text-sm font-bold text-ink">{t.t}</p>
                <p className="text-xs text-ink/55">{t.s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- faq ---------------- */}
        <section className="container-px mb-20 mt-14 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-600">✦ FAQ ✦</span>
            <h2 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-ink/60">Find answers to common questions about our services and consultations.</p>
            <div className="mt-8">
              <ContactFaq />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

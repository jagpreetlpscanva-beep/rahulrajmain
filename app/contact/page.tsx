import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { Mandala } from "../components/ui/Mandala";
import { LotusDivider, Diamond } from "../components/ui/Dividers";
import { WhatsAppIcon } from "../components/icons";

export const metadata: Metadata = {
  title: "Contact — Astro Rahul Raj, Vedic Astrologer",
  description: "Get in touch with Astro Rahul Raj on WhatsApp or phone for personal Vedic astrology consultations.",
};

const PHONE = "+91 94153 12590";
const WHATSAPP = "https://wa.me/919415312590";
const EMAIL = "associationsjagpreetco@gmail.com";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* hero */}
        <section className="relative overflow-hidden bg-sunset-orange pt-32 pb-16 text-cream lg:pt-40">
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_280px_80px_rgba(70,34,10,0.5)]" />
          <Mandala className="pointer-events-none absolute -right-20 -top-10 h-80 w-80 text-cream/[0.08]" />
          <div className="container-px relative text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-luxe-gold/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-luxe-gold">
              <Diamond className="h-2.5 w-2.5" /> Get In Touch
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              We&rsquo;d Love To <span className="text-luxe-gold">Hear From You</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
              Have a question or want to book a consultation? Reach out — we usually reply within a few hours.
            </p>
          </div>
        </section>

        {/* contact cards */}
        <section className="bg-[#faf4e8] py-16 lg:py-24">
          <div className="container-px mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-3">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-emerald-500/30 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white"><WhatsAppIcon className="h-7 w-7" /></span>
                <h3 className="mt-3 font-serif text-lg font-bold text-ink">WhatsApp</h3>
                <p className="mt-1 text-sm text-emerald-700">{PHONE}</p>
              </a>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="rounded-2xl border-2 border-gold-500/25 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-night">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.9 2Z" /></svg>
                </span>
                <h3 className="mt-3 font-serif text-lg font-bold text-ink">Call</h3>
                <p className="mt-1 text-sm text-gold-700">{PHONE}</p>
              </a>
              <a href={`mailto:${EMAIL}`} className="rounded-2xl border-2 border-gold-500/25 bg-white p-6 text-center shadow-card transition-transform hover:-translate-y-1">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-night">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                </span>
                <h3 className="mt-3 font-serif text-lg font-bold text-ink">Email</h3>
                <p className="mt-1 break-all text-xs text-gold-700">{EMAIL}</p>
              </a>
            </div>

            <div className="mt-10 text-center">
              <LotusDivider className="mx-auto" />
              <p className="mt-6 text-ink/70">Prefer to chat? Message us directly on WhatsApp.</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-emerald-600">
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

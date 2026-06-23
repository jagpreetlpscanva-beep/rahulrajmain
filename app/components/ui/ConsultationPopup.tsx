"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, CloseIcon, WhatsAppIcon } from "../icons";

export function ConsultationPopup() {
  const [open, setOpen] = useState(false);

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
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/5 text-ink/60 transition-colors hover:bg-black/10 hover:text-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* header band */}
            <div className="relative bg-sunset-orange px-8 pb-10 pt-9 text-center text-cream">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/35 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider backdrop-blur-sm">
                ✦ Limited-Time Offer
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
                Talk to Rahul Raj
              </h3>
              <p className="mt-1.5 text-sm text-cream/85">
                Personal 1-on-1 Vedic consultation
              </p>
            </div>

            {/* body */}
            <div className="px-8 pb-8 pt-6 text-center">
              <div className="-mt-14 inline-flex items-end gap-2 rounded-2xl border border-gold-500/30 bg-white px-6 py-3 shadow-card">
                <span className="text-lg text-ink/40 line-through">₹999</span>
                <span className="font-serif text-4xl font-bold text-gold-700">₹499</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                Get clear answers on career, marriage, health, money &amp; the right timing —
                guided by 20+ years of authentic Vedic astrology.
              </p>

              <a
                href="/book/consultation/quick"
                onClick={close}
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
              >
                <CalendarIcon className="h-5 w-5" />
                Book Now for ₹499
              </a>
              <a
                href="/#contact"
                onClick={close}
                className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Or chat on WhatsApp
              </a>
              <button
                type="button"
                onClick={close}
                className="mt-3 text-xs font-medium text-ink/45 hover:text-ink/70"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

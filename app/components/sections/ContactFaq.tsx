"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How can I book a consultation?",
    a: "Click any “Book Consultation” button, pick an available slot, and fill in your details. You’ll receive a confirmation right away.",
  },
  {
    q: "What information do I need to provide?",
    a: "Your name, date, exact time and place of birth. These details let us prepare an accurate Vedic birth-chart analysis for you.",
  },
  {
    q: "How soon will I get a response?",
    a: "We usually reply within a few hours during working hours (Mon–Sat, 10:00 AM – 7:30 PM IST).",
  },
  {
    q: "Is my personal information safe?",
    a: "Absolutely. Your details are kept strictly confidential and are never shared with anyone.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, all major cards, net-banking and popular wallets through a secure payment gateway.",
  },
];

export function ContactFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="overflow-hidden rounded-xl border border-gold-500/20 bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink">{f.q}</span>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 shrink-0 text-gold-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-ink/65">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

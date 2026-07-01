"use client";

import { useState, type FormEvent } from "react";

const PersonIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);
const PinIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
const SunburstIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.6 4.2L18 4.6l-1.6 4.4L21 11l-4.2 1.6L18 17l-4.4-1.6L11 21l-1.6-4.2L4.6 18l1.6-4.4L2 11l4.2-1.6L4.6 4.6 9 6.2 11 2Z" opacity="0.25" />
    <circle cx="12" cy="11.5" r="3" />
  </svg>
);

export function KundaliGenerator() {
  const [form, setForm] = useState({ name: "", dob: "", tob: "", place: "" });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dob) return;
    setDone(true);
  };

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gold-500/30 bg-white p-6 shadow-card lg:p-8">
      <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold-500/30 bg-gold-50 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold-700">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" /></svg>
        Free Janam Kundli
      </span>
      <h3 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
        Generate Your <span className="text-gold-600">Birth Chart</span>
      </h3>
      {/* ornament divider */}
      <span className="mt-3 flex items-center gap-2 text-gold-500">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
        <svg viewBox="0 0 28 12" className="h-2.5 w-7" aria-hidden="true">
          <path d="M4 6 L14 1 L24 6 L14 11Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M14 3.5 L17 6 L14 8.5 L11 6Z" fill="currentColor" />
        </svg>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
      </span>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        Enter your birth details and get your personalized Vedic Kundli prepared by Dr. Rahul Raj.
      </p>

      {done ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-50/60 p-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-night">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="mt-4 font-serif text-lg font-bold text-ink">Thank you, {form.name.split(" ")[0]}!</p>
          <p className="mt-1.5 text-sm text-ink/70">
            Your details are received. Dr. Rahul Raj will prepare your Janam Kundli. For a detailed reading, book a consultation.
          </p>
          <a href="/book/consultation/quick" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn">
            Book Detailed Reading →
          </a>
          <button type="button" onClick={() => setDone(false)} className="mt-3 text-xs font-medium text-gold-700 underline">
            Generate another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 flex flex-1 flex-col gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative">
              <input className={`${inputCls} pr-10`} placeholder="Your name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              <PersonIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-500/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="date" className={inputCls} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Time of Birth</label>
              <input type="time" className={inputCls} value={form.tob} onChange={(e) => set("tob", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Place of Birth</label>
            <div className="relative">
              <input className={`${inputCls} pr-10`} placeholder="City, Country" value={form.place} onChange={(e) => set("place", e.target.value)} />
              <PinIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-500/60" />
            </div>
          </div>
          <button
            type="submit"
            className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
          >
            <SunburstIcon className="h-5 w-5" />
            Generate Kundli
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-500/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
            Your information is 100% safe and private
          </p>
        </form>
      )}
    </div>
  );
}

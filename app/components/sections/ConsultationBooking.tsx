"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "../icons";
import type { IconName } from "@/lib/content";
import type { Slot, Consultation } from "@/lib/adminStore";

const TOPICS: { label: string; icon: IconName }[] = [
  { label: "Career & Business", icon: "briefcase" },
  { label: "Health & Family", icon: "lotus-person" },
  { label: "Marriage & Relationships", icon: "couple" },
  { label: "Property & Investments", icon: "wealth" },
  { label: "Finance & Wealth", icon: "magnet" },
  { label: "Spiritual Guidance", icon: "om" },
];

const MODES = ["WhatsApp", "Audio Call", "Video Call", "In-Person"];

const TRUST = [
  { icon: "shield" as IconName, label: "100% Confidential" },
  { icon: "medal" as IconName, label: "15+ Years Experience" },
  { icon: "users" as IconName, label: "40,000+ Consultations" },
  { icon: "star" as IconName, label: "4.9/5 Client Rating" },
];

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

const FALLBACK_TYPES = ["Personal Consultation", "Career Guidance", "Marriage Matching", "Business Astrology"];

export function ConsultationBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [types, setTypes] = useState<string[]>(FALLBACK_TYPES);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ctype, setCtype] = useState(FALLBACK_TYPES[0]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [mode, setMode] = useState(MODES[2]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/content/slots", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: Slot[]) => setSlots(Array.isArray(s) ? s.filter((x) => !x.booked) : []))
      .catch(() => {});
    fetch("/api/content/consultations", { cache: "no-store" })
      .then((r) => r.json())
      .then((c: Consultation[]) => {
        if (Array.isArray(c) && c.length) {
          const t = c.map((x) => x.title).filter(Boolean);
          setTypes(t);
          setCtype(t[0]);
        }
      })
      .catch(() => {});
  }, []);

  const dates = useMemo(() => Array.from(new Set(slots.map((s) => s.date))).sort(), [slots]);
  const daySlots = useMemo(() => slots.filter((s) => s.date === (date || dates[0])), [slots, date, dates]);
  const todaySlots = useMemo(() => slots.slice(0, 4), [slots]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and mobile number.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "consultation",
          itemId: "quick",
          itemTitle: `${ctype} (${mode})`,
          amount: "₹999",
          slotId: slot?.id,
          slotDate: slot?.date,
          slotTime: slot?.time,
          name,
          phone,
          email: "",
          paid: "true",
        }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error || "Could not complete booking.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-night py-16 lg:py-24">
      <div className="amber-radial pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-px relative">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ---- left: pitch ---- */}
          <div className="text-ivory">
            <span className="eyebrow inline-block rounded-full border border-luxe-gold/40 px-3 py-1 text-luxe-gold">
              Personal Consultation
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Book Your Personal Consultation
            </h2>
            <p className="mt-2 text-ivory/70">Get direct guidance from Astro Rahul Raj.</p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TOPICS.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2.5 rounded-xl border border-luxe-gold/15 bg-white/5 p-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-luxe-gold/40 text-luxe-gold">
                    <Icon name={t.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-ivory/90">{t.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-4 rounded-2xl border border-luxe-gold/20 bg-white/5 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-luxe-gold/50">
                <Image src="/hero-astrologer.png" alt="Astro Rahul Raj" fill className="object-cover object-top" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-ivory">Astro Rahul Raj</p>
                <p className="flex items-center gap-1 text-sm text-luxe-gold">
                  <span>★★★★★</span>
                  <span className="text-ivory/70">4.9/5 · 40,000+ consultations</span>
                </p>
              </div>
            </div>

            {todaySlots.length > 0 && (
              <div className="mt-5 rounded-2xl border border-luxe-gold/20 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-luxe-gold">Today&rsquo;s available slots</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {todaySlots.map((s) => (
                    <span key={s.id} className="rounded-lg border border-luxe-gold/25 px-3 py-1.5 text-xs text-ivory/85">
                      {fmtDate(s.date)} · {s.time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ---- right: form ---- */}
          <div className="rounded-3xl border border-luxe-gold/25 bg-paper-bg p-6 shadow-card sm:p-7">
            {done ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-night">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="mt-5 font-serif text-2xl font-bold text-ink">Consultation Booked!</h3>
                <p className="mt-2 text-sm text-ink/70">
                  Thank you, {name.split(" ")[0]}. We&rsquo;ll reach out on {phone} to confirm your {ctype.toLowerCase()}
                  {slot ? <> for <strong>{fmtDate(slot.date)}, {slot.time}</strong></> : null}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wide text-ink">Schedule Consultation</h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    className={fieldCls}
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className={fieldCls}
                    placeholder="Mobile Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Consultation Type</p>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCtype(t)}
                      className={chip(ctype === t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Select Date</p>
                {dates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dates.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => { setDate(d); setSlot(null); }}
                        className={chip((date || dates[0]) === d)}
                      >
                        {fmtDate(d)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input type="date" className={fieldCls} value={date} onChange={(e) => setDate(e.target.value)} />
                )}

                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Available Time Slots</p>
                {daySlots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlot(s)}
                        className={chip(slot?.id === s.id)}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink/55">No open slots right now — we&rsquo;ll call you to schedule.</p>
                )}

                <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Consultation Mode</p>
                <div className="flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button key={m} type="button" onClick={() => setMode(m)} className={chip(mode === m)}>
                      {m}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-gold-500/25 bg-gold-50/60 px-4 py-3">
                  <span className="text-sm text-ink/65">Consultation Fee</span>
                  <span className="font-serif text-2xl font-bold text-gold-700">₹999</span>
                </div>

                {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 w-full rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-50"
                >
                  {busy ? "Processing…" : "Proceed to Payment"}
                </button>
                <p className="mt-2 text-center text-xs text-ink/40">Demo payment — connect Razorpay/Stripe for live payments.</p>
              </form>
            )}
          </div>
        </div>

        {/* ---- trust badges ---- */}
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-2.5 rounded-xl border border-luxe-gold/20 bg-white/5 px-4 py-3 text-ivory">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-luxe-gold/40 text-luxe-gold">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold leading-tight text-ivory/90">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const fieldCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

function chip(active: boolean) {
  return `rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
    active ? "border-gold-600 bg-gold-gradient text-night" : "border-ink/15 text-ink/75 hover:border-gold-500"
  }`;
}

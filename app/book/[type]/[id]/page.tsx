"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/sections/Footer";
import { ScrollToTop } from "../../../components/ui/ScrollToTop";
import type { Slot, Addon } from "@/lib/adminStore";

const COLL: Record<string, string> = {
  consultation: "consultations",
  report: "reports",
  course: "courses",
  pooja: "poojas",
};

interface Item {
  id: string;
  title: string;
  price?: string;
  description?: string;
  duration?: string;
  mode?: string;
}

const FALLBACK: Record<string, Item> = {
  consultation: { id: "quick", title: "Personal Consultation", price: "₹499", duration: "30 mins", mode: "Video / Call" },
  report: { id: "quick", title: "Astrology Report", price: "₹999" },
  course: { id: "quick", title: "Course", price: "₹999" },
  pooja: { id: "quick", title: "Online Puja", price: "₹999" },
};

function parsePrice(p?: string): number {
  if (!p) return 0;
  const n = Number(String(p).replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function fmtINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

export default function BookingPage() {
  const params = useParams<{ type: string; id: string }>();
  const type = params.type;
  const id = params.id;
  const needsSlot = type === "consultation";

  const [item, setItem] = useState<Item | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  // add-ons are upsells for purchasable products, not live consultations
  const showAddons = type !== "consultation";

  const [slot, setSlot] = useState<Slot | null>(null);
  const [paid, setPaid] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const coll = COLL[type] || "consultations";
    fetch(`/api/content/${coll}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Item[]) => {
        const found = Array.isArray(data) ? data.find((x) => x.id === id) : null;
        setItem(found || FALLBACK[type] || FALLBACK.consultation);
      })
      .catch(() => setItem(FALLBACK[type] || FALLBACK.consultation))
      .finally(() => setLoaded(true));
    if (needsSlot) {
      fetch(`/api/content/slots`, { cache: "no-store" })
        .then((r) => r.json())
        .then((s: Slot[]) => setSlots(Array.isArray(s) ? s.filter((x) => !x.booked) : []))
        .catch(() => {});
    }
    if (type !== "consultation") {
      fetch(`/api/content/addons`, { cache: "no-store" })
        .then((r) => r.json())
        .then((a: Addon[]) => setAddons(Array.isArray(a) ? a : []))
        .catch(() => {});
    }
  }, [type, id, needsSlot]);

  const chosenAddons = useMemo(
    () => addons.filter((a) => selectedAddons.includes(a.id)),
    [addons, selectedAddons]
  );
  const total = useMemo(
    () => parsePrice(item?.price) + chosenAddons.reduce((sum, a) => sum + (a.price || 0), 0),
    [item, chosenAddons]
  );
  const toggleAddon = (aid: string) =>
    setSelectedAddons((prev) => (prev.includes(aid) ? prev.filter((x) => x !== aid) : [...prev, aid]));

  // build the step list
  const steps = needsSlot ? (["Slot", "Details", "Payment"] as const) : (["Details", "Payment"] as const);
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  const slotsByDate = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    slots.forEach((s) => {
      (map[s.date] ||= []).push(s);
    });
    return map;
  }, [slots]);

  const confirm = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: type,
          itemId: item?.id || id,
          itemTitle: item?.title || "",
          amount: showAddons ? fmtINR(total) : item?.price || "",
          addons: chosenAddons.map((a) => a.title),
          slotId: slot?.id,
          slotDate: slot?.date,
          slotTime: slot?.time,
          name: form.name,
          phone: form.phone,
          email: form.email,
          paid: "true",
        }),
      });
      const data = await res.json();
      if (res.ok) setDone(true);
      else setError(data.error || "Could not complete booking");
    } catch {
      setError("Network error — please try again");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <>
      <Navbar />
      <main className="paper-bg min-h-screen px-5 pb-20 pt-32 lg:pt-40">
        <div className="mx-auto max-w-2xl">
          <a href={`/${type === "consultation" ? "consultation" : COLL[type] || ""}`} className="text-sm text-ink/55 hover:text-gold-700">
            ← Back
          </a>

          {!loaded ? (
            <p className="mt-10 text-center text-ink/50">Loading…</p>
          ) : done ? (
            <Confirmation item={item!} slot={slot} name={form.name} />
          ) : (
            <div className="mt-4 rounded-3xl border border-gold-500/25 bg-white p-6 shadow-card sm:p-8">
              {/* header */}
              <p className="eyebrow text-gold-600">Booking</p>
              <h1 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">{item?.title}</h1>
              {item?.price && (
                <p className="mt-1 font-serif text-xl font-bold text-gold-700">{item.price}</p>
              )}

              {/* stepper */}
              <div className="mt-6 flex items-center gap-2">
                {steps.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-2">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        i <= stepIdx ? "bg-gold-gradient text-night" : "bg-ink/10 text-ink/40"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-xs font-semibold ${i <= stepIdx ? "text-ink" : "text-ink/40"}`}>{s}</span>
                    {i < steps.length - 1 && <span className="h-px flex-1 bg-ink/10" />}
                  </div>
                ))}
              </div>

              <div className="mt-7">
                {/* ---- slot ---- */}
                {step === "Slot" && (
                  <div>
                    <h2 className="font-serif text-lg font-bold text-ink">Choose a slot</h2>
                    {Object.keys(slotsByDate).length === 0 ? (
                      <p className="mt-3 text-sm text-ink/60">
                        No open slots right now — continue and we&rsquo;ll call you to schedule.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {Object.entries(slotsByDate).map(([date, list]) => (
                          <div key={date}>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">{fmtDate(date)}</p>
                            <div className="flex flex-wrap gap-2">
                              {list.map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setSlot(s)}
                                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                    slot?.id === s.id
                                      ? "border-gold-600 bg-gold-gradient text-night"
                                      : "border-ink/15 text-ink/75 hover:border-gold-500"
                                  }`}
                                >
                                  {s.time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setStepIdx(1)}
                      disabled={Object.keys(slotsByDate).length > 0 && !slot}
                      className="mt-6 w-full rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* ---- payment ---- */}
                {step === "Payment" && (
                  <div className="text-center">
                    <h2 className="font-serif text-lg font-bold text-ink">Payment</h2>
                    {slot && (
                      <p className="mt-2 text-sm text-ink/65">
                        Slot: <strong>{fmtDate(slot.date)}, {slot.time}</strong>
                      </p>
                    )}

                    {/* add-on upsells (admin-editable) */}
                    {showAddons && addons.length > 0 && (
                      <div className="mt-5 text-left">
                        <p className="text-center text-xs font-semibold uppercase tracking-wider text-gold-700">
                          Enhance your order
                        </p>
                        <div className="mt-3 space-y-2.5">
                          {addons.map((a) => {
                            const on = selectedAddons.includes(a.id);
                            return (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => toggleAddon(a.id)}
                                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                                  on ? "border-gold-600 bg-gold-50/70" : "border-ink/12 hover:border-gold-500/60"
                                }`}
                              >
                                <span
                                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                                    on ? "border-gold-600 bg-gold-gradient text-night" : "border-ink/25"
                                  }`}
                                >
                                  {on && (
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-ink">{a.title}</span>
                                    <span className="shrink-0 font-serif font-bold text-gold-700">+{fmtINR(a.price)}</span>
                                  </span>
                                  {a.description && <span className="mt-0.5 block text-xs text-ink/55">{a.description}</span>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-gold-500/25 bg-gold-50/60 p-5">
                      <p className="text-sm text-ink/60">Amount payable</p>
                      <p className="font-serif text-4xl font-bold text-gold-700">
                        {showAddons ? fmtINR(total) : item?.price || "₹499"}
                      </p>
                      {showAddons && chosenAddons.length > 0 && (
                        <p className="mt-1 text-xs text-ink/50">
                          {item?.price || "—"} base + {chosenAddons.length} add-on{chosenAddons.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPaid(true);
                        confirm();
                      }}
                      disabled={busy}
                      className="mt-6 w-full rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-60"
                    >
                      {busy ? "Processing…" : `Pay ${showAddons ? fmtINR(total) : item?.price || "₹499"} & Confirm Booking`}
                    </button>
                    {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
                    <p className="mt-3 text-xs text-ink/40">Demo payment — add Razorpay keys for live payments.</p>
                    <button type="button" onClick={() => setStepIdx(needsSlot ? 1 : 0)} className="mt-2 text-xs text-ink/50 underline">
                      ← back
                    </button>
                  </div>
                )}

                {/* ---- details ---- */}
                {step === "Details" && (
                  <div>
                    <h2 className="font-serif text-lg font-bold text-ink">Your details</h2>
                    <p className="mt-1 text-sm text-ink/55">We&rsquo;ll confirm your booking on this number.</p>
                    <div className="mt-4 space-y-3">
                      <input className={inputCls} placeholder="Full name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                      <input className={inputCls} placeholder="Phone number *" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                      <input className={inputCls} placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    </div>
                    <button
                      type="button"
                      onClick={() => { if (form.name.trim() && form.phone.trim()) setStepIdx(needsSlot ? 2 : 1); }}
                      disabled={!form.name.trim() || !form.phone.trim()}
                      className="mt-5 w-full rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                    {needsSlot && (
                      <button type="button" onClick={() => setStepIdx(0)} className="mt-2 block w-full text-center text-xs text-ink/50 underline">
                        ← change slot
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function Confirmation({ item, slot, name }: { item: Item; slot: Slot | null; name: string }) {
  return (
    <div className="mt-4 rounded-3xl border border-gold-500/25 bg-white p-8 text-center shadow-card">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-night">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <h1 className="mt-5 font-serif text-2xl font-bold text-ink sm:text-3xl">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-ink/70">
        Thank you, {name.split(" ")[0]}. Your <strong>{item.title}</strong> is booked
        {slot ? (
          <>
            {" "}for <strong>{fmtDate(slot.date)}, {slot.time}</strong>
          </>
        ) : null}
        . We&rsquo;ll reach out shortly to confirm.
      </p>
      <a href="/" className="mt-6 inline-block rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn">
        Back to Home
      </a>
    </div>
  );
}

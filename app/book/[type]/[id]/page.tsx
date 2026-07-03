"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/sections/Footer";
import { ScrollToTop } from "../../../components/ui/ScrollToTop";
import type { Slot, Addon, Coupon } from "@/lib/adminStore";
import { applyCoupon, type CouponResult } from "@/lib/coupons";

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

function fmtFull(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  } catch {
    return d;
  }
}

/** Local YYYY-MM-DD (not UTC, so IST early-morning doesn't shift to "yesterday"). */
function localYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Next 14 days from today, excluding Sundays — date picker for consultation slots. */
function buildAvailableDates(): string[] {
  const dates: string[] = [];
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  while (dates.length < 14) {
    if (cur.getDay() !== 0) dates.push(localYmd(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Whether this is the offline (in-person) or online consultation, derived from the item id.
  // Used to filter slots by type and to offer "cash on the day" only for offline bookings.
  const consultationType: "online" | "offline" = id === "offline-consultation" ? "offline" : "online";
  const showPaymentChoice = type === "consultation" && consultationType === "offline";
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | null>(showPaymentChoice ? null : "online");

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponRes, setCouponRes] = useState<CouponResult | null>(null);

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
        .then((s: Slot[]) => setSlots(Array.isArray(s) ? s : []))
        .catch(() => {});
    }
    if (type !== "consultation") {
      fetch(`/api/content/addons`, { cache: "no-store" })
        .then((r) => r.json())
        .then((a: Addon[]) => setAddons(Array.isArray(a) ? a : []))
        .catch(() => {});
    }
    fetch(`/api/content/coupons`, { cache: "no-store" })
      .then((r) => r.json())
      .then((c: Coupon[]) => setCoupons(Array.isArray(c) ? c : []))
      .catch(() => {});
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

  // base order amount (with add-ons) before any coupon
  const baseTotal = showAddons ? total : parsePrice(item?.price);
  const discount = couponRes?.ok ? couponRes.discount : 0;
  const finalTotal = Math.max(0, baseTotal - discount);

  const applyCode = () => setCouponRes(applyCoupon(coupons, couponCode, baseTotal));
  const clearCoupon = () => { setCouponRes(null); setCouponCode(""); };

  // build the step list
  const steps = needsSlot ? (["Slot", "Details", "Payment"] as const) : (["Details", "Payment"] as const);
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  // Only slots matching this consultation's mode (online/offline) are eligible.
  // Untyped legacy slots default to "online" (matches the admin's own behaviour).
  const slotsForType = useMemo(
    () => slots.filter((s) => (s.type ?? "online") === consultationType),
    [slots, consultationType]
  );
  const availableDates = useMemo(() => buildAvailableDates(), []);
  const timesForSelectedDate = useMemo(
    () => slotsForType.filter((s) => s.date === selectedDate),
    [slotsForType, selectedDate]
  );

  const confirm = async (paymentId?: string) => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setBusy(true);
    setError("");
    try {
      const paidOnline = paymentMethod !== "cash" && !!paymentId;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: type,
          itemId: item?.id || id,
          itemTitle: item?.title || "",
          amount: fmtINR(finalTotal),
          addons: chosenAddons.map((a) => a.title),
          coupon: couponRes?.ok ? `${couponRes.coupon?.title} (−${fmtINR(discount)})` : "",
          slotId: slot?.id,
          slotDate: slot?.date,
          slotTime: slot?.time,
          name: form.name,
          phone: form.phone,
          email: form.email,
          paid: paymentMethod === "cash" ? "false" : paidOnline ? "true" : "false",
          paymentMethod: paymentMethod || "online",
          paymentId: paymentId || "",
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

  // ---- Razorpay online payment ----
  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const payAndConfirm = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone first.");
      return;
    }
    // cash-on-day (offline consultations) — no online payment
    if (paymentMethod === "cash") {
      setPaid(false);
      confirm();
      return;
    }

    setBusy(true);
    setError("");
    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal, name: form.name, phone: form.phone, item: item?.title }),
      });
      const order = await orderRes.json();

      // if payments aren't configured yet, still capture the booking (unpaid)
      if (!orderRes.ok || !order.ok) {
        setPaid(false);
        await confirm();
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        setError("Couldn't load the payment window. Please try again.");
        setBusy(false);
        return;
      }

      const RZP = (window as unknown as { Razorpay: new (o: Record<string, unknown>) => { open: () => void } }).Razorpay;
      const rzp = new RZP({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Dr. Rahul Raj — Vedic Astrologer",
        description: item?.title || "Consultation",
        image: "/brand/logo.png",
        prefill: { name: form.name, contact: form.phone, email: form.email },
        theme: { color: "#C08A2E" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const vr = await v.json();
          if (vr.ok) {
            setPaid(true);
            await confirm(resp.razorpay_payment_id);
          } else {
            setError("Payment could not be verified. If money was deducted, contact us on WhatsApp.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch {
      setError("Could not start payment. Please try again.");
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
            <Confirmation item={item!} slot={slot} name={form.name} type={type} consultationType={consultationType} />
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
                    {slotsForType.length === 0 ? (
                      <>
                        <h2 className="font-serif text-lg font-bold text-ink">Choose a slot</h2>
                        <p className="mt-3 text-sm text-ink/60">
                          No open slots right now — continue and we&rsquo;ll call you to schedule.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-serif text-lg font-bold text-ink">Choose a Date</h2>
                        <p className="mt-0.5 text-xs text-ink/50">Sundays excluded. Showing next 14 available days.</p>
                        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
                          {availableDates.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setSelectedDate(d);
                                setSlot(null);
                              }}
                              className={`flex flex-col items-center rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                                selectedDate === d
                                  ? "border-gold-600 bg-gold-gradient text-night shadow-gold-btn"
                                  : "border-ink/15 text-ink/70 hover:border-gold-500"
                              }`}
                            >
                              <span className="text-[10px] uppercase tracking-wide opacity-70">
                                {new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}
                              </span>
                              <span className="text-base font-bold leading-tight">{new Date(`${d}T00:00:00`).getDate()}</span>
                              <span className="text-[10px] opacity-70">
                                {new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { month: "short" })}
                              </span>
                            </button>
                          ))}
                        </div>

                        {selectedDate && (
                          <div className="mt-6">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                                Available times for {fmtFull(selectedDate)}
                              </p>
                              <div className="flex shrink-0 items-center gap-3 text-[11px] text-ink/50">
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Open
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Booked
                                </span>
                              </div>
                            </div>
                            {timesForSelectedDate.length === 0 ? (
                              <p className="mt-3 text-sm text-ink/60">No slots available for this date — try another date.</p>
                            ) : (
                              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                {timesForSelectedDate.map((s) => {
                                  const isSelected = slot?.id === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      type="button"
                                      disabled={s.booked}
                                      onClick={() => !s.booked && setSlot(s)}
                                      className={`flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                                        s.booked
                                          ? "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-400"
                                          : isSelected
                                          ? "border-gold-600 bg-gold-gradient text-night shadow-gold-btn"
                                          : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500 hover:bg-emerald-100"
                                      }`}
                                    >
                                      <span>{s.time}</span>
                                      {s.booked && <span className="text-[10px] font-medium normal-case">(Booked)</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setStepIdx(1)}
                      disabled={slotsForType.length > 0 && !slot}
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

                    {/* offline consultations: choose cash-on-the-day vs pay online now */}
                    {showPaymentChoice && (
                      <div className="mt-5 text-left">
                        <p className="text-center text-xs font-semibold uppercase tracking-wider text-gold-700">
                          How would you like to pay?
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cash")}
                            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-sm font-semibold transition-colors ${
                              paymentMethod === "cash"
                                ? "border-gold-600 bg-gold-50 text-gold-800 shadow-sm"
                                : "border-ink/15 bg-white text-ink/70 hover:border-gold-400"
                            }`}
                          >
                            <span className="text-2xl">💵</span>
                            Cash on Consultation Day
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("online")}
                            className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-sm font-semibold transition-colors ${
                              paymentMethod === "online"
                                ? "border-gold-600 bg-gold-50 text-gold-800 shadow-sm"
                                : "border-ink/15 bg-white text-ink/70 hover:border-gold-400"
                            }`}
                          >
                            <span className="text-2xl">💳</span>
                            Pay Online Now
                          </button>
                        </div>
                      </div>
                    )}

                    {/* coupon */}
                    <div className="mx-auto mt-5 max-w-xs text-left">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/55">Have a coupon?</label>
                      {couponRes?.ok ? (
                        <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-sm">
                          <span className="font-semibold text-emerald-700">
                            {couponRes.coupon?.title} applied · −{fmtINR(discount)}
                          </span>
                          <button type="button" onClick={clearCoupon} className="text-xs font-medium text-emerald-700 underline">remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            className={`${inputCls} uppercase`}
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }}
                          />
                          <button type="button" onClick={applyCode} className="shrink-0 rounded-lg border border-gold-500/40 bg-gold-50 px-4 text-sm font-semibold text-gold-700 hover:bg-gold-100">
                            Apply
                          </button>
                        </div>
                      )}
                      {couponRes && !couponRes.ok && (
                        <p className="mt-1.5 text-xs font-medium text-rose-600">{couponRes.message}</p>
                      )}
                    </div>

                    <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-gold-500/25 bg-gold-50/60 p-5">
                      <p className="text-sm text-ink/60">
                        {paymentMethod === "cash" ? "Amount due on consultation day" : "Amount payable"}
                      </p>
                      {discount > 0 && (
                        <p className="text-sm text-ink/40 line-through">{fmtINR(baseTotal)}</p>
                      )}
                      <p className="font-serif text-4xl font-bold text-gold-700">{fmtINR(finalTotal)}</p>
                      {discount > 0 ? (
                        <p className="mt-1 text-xs font-semibold text-emerald-600">You saved {fmtINR(discount)}!</p>
                      ) : showAddons && chosenAddons.length > 0 ? (
                        <p className="mt-1 text-xs text-ink/50">
                          {item?.price || "—"} base + {chosenAddons.length} add-on{chosenAddons.length > 1 ? "s" : ""}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={payAndConfirm}
                      disabled={busy || (showPaymentChoice && !paymentMethod)}
                      className="mt-6 w-full rounded-lg bg-gold-gradient px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-60"
                    >
                      {busy
                        ? "Processing…"
                        : paymentMethod === "cash"
                        ? "Confirm Booking — Pay Cash on the Day"
                        : `Pay ${fmtINR(finalTotal)} & Confirm Booking`}
                    </button>
                    {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
                    {paymentMethod !== "cash" && (
                      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/40">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                        Secure payment by Razorpay · UPI, cards, net-banking
                      </p>
                    )}
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

function Confirmation({
  item, slot, name, type, consultationType,
}: { item: Item; slot: Slot | null; name: string; type: string; consultationType: "online" | "offline" }) {
  const isOnline = type !== "consultation" || consultationType === "online";
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
        .
      </p>

      {/* clear next steps so the person knows where to go */}
      <div className="mt-6 rounded-2xl border border-gold-500/20 bg-gold-50/50 p-5 text-left">
        <p className="text-sm font-bold text-ink">आगे क्या करें?</p>
        {type === "report" ? (
          <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
            Apni report ab <strong>My Account</strong> me phone number daal ke kabhi bhi dekh/download kar sakte hain.
            Koi query ho toh WhatsApp karein: <a href="https://wa.me/919415312590" className="font-semibold text-gold-700 underline">+91 94153 12590</a>.
          </p>
        ) : type === "consultation" && !isOnline ? (
          <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
            Yeh ek <strong>offline / in-person</strong> consultation hai — apne booked slot par humare office pahunch jaayein.
            Address aur exact location WhatsApp/SMS par bhej di jaayegi. Koi confusion ho toh call/WhatsApp karein:{" "}
            <a href="https://wa.me/919415312590" className="font-semibold text-gold-700 underline">+91 94153 12590</a>.
          </p>
        ) : (
          <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
            Yeh ek <strong>online</strong> session hai — aapke booked slot se pehle Google Meet/WhatsApp video-call ka link
            aapke phone/email par bhej diya jaayega. Kahin jaane ki zaroorat nahi, bas apne slot time par phone/laptop ke paas rahein.
            Koi query ho toh WhatsApp karein: <a href="https://wa.me/919415312590" className="font-semibold text-gold-700 underline">+91 94153 12590</a>.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a href="/my-account" className="inline-block rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn">
          Go to My Account →
        </a>
        <a href="/" className="inline-block rounded-lg border border-gold-500/40 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gold-700">
          Back to Home
        </a>
      </div>
    </div>
  );
}

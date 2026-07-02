"use client";

import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { BRAND_LOGO_SRC } from "../components/ui/Logo";

type Booking = {
  id: string;
  itemType: string;
  itemTitle: string;
  amount: string;
  slotDate?: string;
  slotTime?: string;
  coupon?: string;
  paid: boolean;
  paymentMethod?: string;
  paymentId?: string;
  status: string;
  createdAt: string;
};

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function MyAccountPage() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [err, setErr] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) { setErr("Please enter a valid 10-digit number."); return; }
    setState("loading");
    setErr("");
    try {
      const r = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error === "invalid_phone" ? "Please enter a valid number." : "Something went wrong."); setState("error"); return; }
      setBookings(Array.isArray(j.bookings) ? j.bookings : []);
      setState("done");
    } catch {
      setErr("Could not connect. Please try again.");
      setState("error");
    }
  };

  const inputCls = "w-full rounded-xl border border-gold-500/25 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/15";

  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        <section className="container-px pt-24 lg:pt-28">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND_LOGO_SRC} alt="Rahul Raj Astro" className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-gold-500/30" />
              <h1 className="mt-4 font-serif text-3xl font-bold text-ink sm:text-4xl">My Account</h1>
              <p className="mt-2 text-sm text-ink/60">
                {state === "done" ? "Your bookings & reports" : "Enter the phone number you booked with to view your orders and reports."}
              </p>
            </div>

            {state !== "done" ? (
              <form onSubmit={login} className="mx-auto mt-8 max-w-sm rounded-3xl border border-gold-500/20 bg-white p-6 shadow-card">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">Phone Number</label>
                <input className={inputCls} inputMode="tel" placeholder="e.g. 9415312590" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {err && <p className="mt-2 text-sm font-medium text-rose-600">{err}</p>}
                <button type="submit" disabled={state === "loading"} className="mt-4 w-full rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn disabled:opacity-60">
                  {state === "loading" ? "Checking…" : "View My Account →"}
                </button>
                <p className="mt-3 text-center text-xs text-ink/45">🔒 We only show orders made with this number.</p>
              </form>
            ) : (
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-ink/60">{bookings.length} order{bookings.length === 1 ? "" : "s"} found</p>
                  <button type="button" onClick={() => { setState("idle"); setBookings([]); setPhone(""); }} className="text-sm text-ink/55 hover:text-gold-700">Log out</button>
                </div>

                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gold-500/25 bg-white p-10 text-center">
                    <p className="text-ink/60">No orders found for this number.</p>
                    <a href="/bookconsultation" className="mt-4 inline-block rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn">Book a Consultation →</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="rounded-2xl border border-gold-500/15 bg-white p-5 shadow-card">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-serif text-lg font-bold text-ink">{b.itemTitle || b.itemType}</p>
                            <p className="mt-0.5 text-xs capitalize text-ink/50">{b.itemType} · {fmt(b.createdAt)}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[b.status] || "bg-ink/10 text-ink/60"}`}>
                            {b.status === "new" ? "Confirmed" : b.status}
                          </span>
                        </div>
                        <div className="mt-3 grid gap-2 border-t border-gold-500/10 pt-3 text-sm sm:grid-cols-2">
                          {b.slotDate && <p className="text-ink/70"><span className="text-ink/45">Slot:</span> {b.slotDate}{b.slotTime ? `, ${b.slotTime}` : ""}</p>}
                          <p className="text-ink/70"><span className="text-ink/45">Amount:</span> {b.amount || "—"} {b.paymentMethod === "cash" ? "(cash on day)" : b.paid ? "(paid)" : ""}</p>
                          {b.coupon && <p className="text-emerald-600">🎟 {b.coupon}</p>}
                          {b.paymentId && <p className="text-ink/45">💳 {b.paymentId}</p>}
                        </div>
                        {b.itemType === "report" && (
                          <a href="/kundli-report" className="mt-3 inline-block rounded-lg border border-gold-500/40 bg-gold-50 px-4 py-2 text-xs font-bold text-gold-700 hover:bg-gold-100">
                            View / Download Report →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <div className="h-20 lg:h-24" />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

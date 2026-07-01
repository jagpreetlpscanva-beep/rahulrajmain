"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useCollection, DEFAULT_REVIEWS, type Review } from "@/lib/adminStore";
import { LotusDivider, Diamond } from "../ui/Dividers";

function Stars({ value, onChange, size = "h-5 w-5" }: { value: number; onChange?: (n: number) => void; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type={onChange ? "button" : undefined}
          onClick={onChange ? () => onChange(n) : undefined}
          className={onChange ? "transition-transform hover:scale-110" : "cursor-default"}
          aria-label={`${n} star`}
        >
          <svg viewBox="0 0 24 24" className={`${size} ${n <= value ? "text-luxe-gold" : "text-ink/20"}`} fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const { items } = useCollection<Review>("reviews", DEFAULT_REVIEWS);
  const approved = useMemo(() => {
    const a = items.filter((r) => r.status === "approved");
    return a.sort((x, y) => Number(!!y.featured) - Number(!!x.featured));
  }, [items]);

  const [idx, setIdx] = useState(0);
  const cur = approved.length ? approved[idx % approved.length] : undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || !rating) {
      setErr("Please add your name, a rating and your review.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, text }),
      });
      const d = await r.json();
      if (r.ok) setDone(true);
      else setErr(d.error || "Could not submit.");
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-[#fbf7ee] px-4 py-3 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <section id="testimonials" className="relative overflow-hidden bg-[#faf4e8] py-10 lg:py-14">
      <div className="container-px">
        <div className="text-center">
          <h2 className="inline-flex items-center gap-3 font-serif text-3xl font-bold uppercase tracking-wide text-ink sm:text-4xl">
            <Diamond className="h-3 w-3 text-gold-500" /> What People Say About Dr. Rahul Raj <Diamond className="h-3 w-3 text-gold-500" />
          </h2>
          <LotusDivider className="mx-auto mt-4" />
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-7 lg:grid-cols-2">
          {/* ---- left: submit a review ---- */}
          <div className="rounded-3xl border-2 border-gold-500/25 bg-white p-6 shadow-card sm:p-8">
            <h3 className="font-serif text-2xl font-bold text-ink">🙏 Share Your Experience</h3>
            <p className="mt-1 text-sm text-ink/55">Your feedback helps others make better decisions.</p>

            {done ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-6 text-center">
                <p className="font-serif text-xl font-bold text-emerald-700">Thank you! 🙏</p>
                <p className="mt-2 text-sm text-ink/70">Your review has been submitted and will appear after approval.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Your Name <span className="text-rose-500">*</span></label>
                  <input className={inputCls} placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Email <span className="font-normal text-ink/45">(optional)</span></label>
                  <input className={inputCls} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Rating <span className="text-rose-500">*</span></label>
                  <Stars value={rating} onChange={setRating} size="h-8 w-8" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Your Review <span className="text-rose-500">*</span></label>
                  <textarea rows={4} maxLength={1000} className={inputCls} placeholder="Share your experience with Astro Rahul Raj..." value={text} onChange={(e) => setText(e.target.value)} />
                  <p className="mt-1 text-right text-xs text-ink/40">{text.length}/1000</p>
                </div>
                {err && <p className="text-sm font-medium text-rose-600">{err}</p>}
                <button type="submit" disabled={busy} className="w-full rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5 disabled:opacity-50">
                  {busy ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}
          </div>

          {/* ---- right: client reviews carousel ---- */}
          <div className="rounded-3xl border-2 border-gold-500/25 bg-white p-6 shadow-card sm:p-8">
            <h3 className="font-serif text-2xl font-bold text-ink">💬 Client Reviews</h3>
            <p className="mt-1 text-sm text-ink/55">Verified experiences from our community.</p>

            {cur ? (
              <div className="mt-6 flex min-h-[16rem] flex-col">
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-gold-400" fill="currentColor" aria-hidden="true">
                  <path d="M7 7h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2H7V7Zm9 0h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2h-2V7Z" />
                </svg>
                <Stars value={cur.rating} />
                <p className="mt-3 flex-1 text-base leading-relaxed text-ink/80">{cur.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient font-serif text-sm font-bold text-night">
                    {cur.initials || cur.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{cur.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-500 text-[8px] text-white">✓</span>
                      Verified Client{cur.location ? ` · ${cur.location}` : ""}
                    </p>
                  </div>
                </div>

                {/* controls */}
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {approved.map((_, i) => (
                      <button key={i} onClick={() => setIdx(i)} aria-label={`Review ${i + 1}`} className={`h-2 rounded-full transition-all ${i === idx % approved.length ? "w-5 bg-gold-gradient" : "w-2 bg-ink/15"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink/50">{(idx % approved.length) + 1} / {approved.length} reviews</span>
                    <button onClick={() => setIdx((i) => (i - 1 + approved.length) % approved.length)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 hover:bg-ink/5">‹</button>
                    <button onClick={() => setIdx((i) => (i + 1) % approved.length)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 hover:bg-ink/5">›</button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-10 text-center text-ink/50">No reviews yet — be the first to share!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

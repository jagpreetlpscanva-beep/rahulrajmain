"use client";

import { useState } from "react";

type IconProps = { className?: string };
const BoltIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
);
const ShieldIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
);
const StarIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3Z" /></svg>
);

const FEATURES = [
  { icon: BoltIcon, t: "Quick Response", s: "We reply within a few hours" },
  { icon: ShieldIcon, t: "100% Confidential", s: "Your information is always safe" },
  { icon: StarIcon, t: "Expert Support", s: "Connect with verified astrologers" },
];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setState("sending");
    try {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      setState("sent");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch {
      setState("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gold-500/25 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/15";

  return (
    <div className="grid gap-8 rounded-3xl border border-gold-500/15 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(120,80,20,0.4)] lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
      {/* left intro */}
      <div>
        <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold-600">
          ✦ Send Us a Message ✦
        </span>
        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">
          We&rsquo;d Love To Hear From You
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Fill out the form and our team will get back to you as soon as possible.
        </p>
        <ul className="mt-6 space-y-4 border-t border-gold-500/15 pt-6">
          {FEATURES.map((f) => (
            <li key={f.t} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-600 ring-1 ring-gold-500/20">
                <f.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{f.t}</span>
                <span className="block text-xs text-ink/55">{f.s}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* form */}
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your Name" required>
            <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Enter your full name" required />
          </Field>
          <Field label="Phone Number">
            <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="Enter your phone number" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Address">
            <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="Enter your email address" />
          </Field>
          <Field label="Subject">
            <input className={inputCls} value={form.subject} onChange={set("subject")} placeholder="What is this regarding?" />
          </Field>
        </div>
        <Field label="Message" required>
          <textarea className={`${inputCls} min-h-[120px] resize-y`} value={form.message} onChange={set("message")} placeholder="Type your message here…" required />
        </Field>

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send Message →"}
        </button>

        {state === "sent" && (
          <p className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
            ✓ Thank you! Your message has been sent — we&rsquo;ll get back to you soon.
          </p>
        )}
        {state === "error" && (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">
            Something went wrong. Please try again or reach us on WhatsApp.
          </p>
        )}

        <p className="text-center text-xs text-ink/45">🔒 Your information is secure and private</p>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink/70">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      {children}
    </label>
  );
}

"use client";

import { useState } from "react";
import { CALCULATORS, CITIES, ZODIAC_SIGNS, type CalcDef } from "@/lib/calculators";

type BirthState = { name: string; date: string; time: string; cityIdx: number };
const emptyBirth = (): BirthState => ({ name: "", date: "", time: "12:00", cityIdx: 0 });

function birthPayload(b: BirthState, prefix = "") {
  const [y, m, d] = (b.date || "").split("-").map(Number);
  const [hh, mm] = (b.time || "12:00").split(":").map(Number);
  const c = CITIES[b.cityIdx] ?? CITIES[0];
  return {
    [`${prefix}day`]: d || 1,
    [`${prefix}month`]: m || 1,
    [`${prefix}year`]: y || 2000,
    [`${prefix}hour`]: hh || 0,
    [`${prefix}min`]: mm || 0,
    [`${prefix}lat`]: c.lat,
    [`${prefix}lon`]: c.lon,
    [`${prefix}tzone`]: c.tzone,
  };
}

const inputCls =
  "w-full rounded-xl border border-gold-500/25 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/15";

export function Calculators() {
  const [active, setActive] = useState<CalcDef | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c)}
            className="group flex items-start gap-4 rounded-2xl border border-gold-500/15 bg-white p-5 text-left shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-50 text-2xl ring-1 ring-gold-500/20">
              {c.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-base font-bold text-ink">{c.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-ink/55">{c.desc}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-600">
                Open calculator
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {active && <CalcModal def={active} onClose={() => setActive(null)} />}
    </>
  );
}

function CalcModal({ def, onClose }: { def: CalcDef; onClose: () => void }) {
  const [b1, setB1] = useState<BirthState>(emptyBirth);
  const [b2, setB2] = useState<BirthState>(emptyBirth);
  const [sign, setSign] = useState<string>(ZODIAC_SIGNS[0]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<unknown>(null);
  const [errMsg, setErrMsg] = useState("");

  const run = async () => {
    let endpoint = def.endpoint;
    let payload: Record<string, unknown> = {};

    if (def.input === "sign") {
      endpoint = `${def.endpoint}/${sign}`;
    } else if (def.input === "match") {
      payload = { ...birthPayload(b1, "m_"), ...birthPayload(b2, "f_") };
    } else if (def.input === "numero") {
      const [y, m, d] = (b1.date || "").split("-").map(Number);
      payload = { name: b1.name, day: d || 1, month: m || 1, year: y || 2000 };
    } else {
      payload = birthPayload(b1);
      if (b1.name) payload.name = b1.name;
    }

    setState("loading");
    setResult(null);
    setErrMsg("");
    try {
      const r = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, payload }),
      });
      const json = await r.json();
      if (!r.ok) {
        setErrMsg(json?.message || (json?.error === "not_configured"
          ? "These calculators are being set up. Please check back soon."
          : "Something went wrong. Please try again."));
        setState("error");
        return;
      }
      setResult(json.data);
      setState("done");
    } catch {
      setErrMsg("Could not connect. Please try again.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="my-8 w-full max-w-lg rounded-3xl border border-gold-500/20 bg-[#FCF8F2] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-50 text-2xl ring-1 ring-gold-500/20">{def.icon}</span>
            <h3 className="font-serif text-xl font-bold text-ink">{def.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-ink/50 hover:bg-ink/5">✕</button>
        </div>

        <div className="mt-5 space-y-4">
          {def.input === "sign" ? (
            <Field label="Your zodiac sign">
              <select className={inputCls} value={sign} onChange={(e) => setSign(e.target.value)}>
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </Field>
          ) : def.input === "match" ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-600">Boy&rsquo;s details</p>
              <BirthFields value={b1} onChange={setB1} showName={false} />
              <p className="pt-1 text-xs font-bold uppercase tracking-wider text-gold-600">Girl&rsquo;s details</p>
              <BirthFields value={b2} onChange={setB2} showName={false} />
            </>
          ) : def.input === "numero" ? (
            <>
              <Field label="Full name" required>
                <input className={inputCls} value={b1.name} onChange={(e) => setB1({ ...b1, name: e.target.value })} placeholder="Your full name" />
              </Field>
              <Field label="Date of birth" required>
                <input type="date" className={inputCls} value={b1.date} onChange={(e) => setB1({ ...b1, date: e.target.value })} />
              </Field>
            </>
          ) : (
            <BirthFields value={b1} onChange={setB1} showName />
          )}

          <button
            type="button"
            onClick={run}
            disabled={state === "loading"}
            className="w-full rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {state === "loading" ? "Calculating…" : "Calculate"}
          </button>

          {state === "error" && (
            <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-700">{errMsg}</p>
          )}

          {state === "done" && (
            <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-gold-500/15 bg-white p-4">
              <JsonView value={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BirthFields({ value, onChange, showName }: { value: BirthState; onChange: (v: BirthState) => void; showName: boolean }) {
  return (
    <div className="space-y-3">
      {showName && (
        <Field label="Name (optional)">
          <input className={inputCls} value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Your name" />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of birth" required>
          <input type="date" className={inputCls} value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} />
        </Field>
        <Field label="Time of birth" required>
          <input type="time" className={inputCls} value={value.time} onChange={(e) => onChange({ ...value, time: e.target.value })} />
        </Field>
      </div>
      <Field label="Place of birth">
        <select className={inputCls} value={value.cityIdx} onChange={(e) => onChange({ ...value, cityIdx: Number(e.target.value) })}>
          {CITIES.map((c, i) => (
            <option key={c.name} value={i}>{c.name}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/70">{label} {required && <span className="text-gold-600">*</span>}</span>
      {children}
    </label>
  );
}

/** Generic, recursive renderer for whatever JSON the API returns. */
function JsonView({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return <span className="text-ink/40">—</span>;

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((v, i) => (
          <div key={i} className="rounded-lg bg-gold-50/40 p-2">
            <JsonView value={v} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className={depth === 0 ? "space-y-1.5" : "space-y-1"}>
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => {
          const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const isPrimitive = v === null || typeof v !== "object";
          return (
            <div key={k} className={isPrimitive ? "flex justify-between gap-3 border-b border-gold-500/10 py-1.5" : "py-1.5"}>
              <span className="text-xs font-semibold text-ink/60">{label}</span>
              {isPrimitive ? (
                <span className="text-right text-sm font-medium text-ink">{String(v)}</span>
              ) : (
                <div className="mt-1"><JsonView value={v} depth={depth + 1} /></div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-sm text-ink">{String(value)}</span>;
}

"use client";

import { useState } from "react";
import { useCollection, DEFAULT_SLOTS, newId, type Slot } from "@/lib/adminStore";

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export function SlotsManager() {
  const { items, save, reset } = useCollection<Slot>("slots", DEFAULT_SLOTS);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const add = () => {
    if (!date || !time.trim()) return;
    save([...items, { id: newId("slot"), date, time: time.trim() }]);
    setTime("");
  };
  const remove = (id: string) => save(items.filter((s) => s.id !== id));
  const toggleBooked = (id: string) =>
    save(items.map((s) => (s.id === id ? { ...s, booked: !s.booked } : s)));

  const sorted = [...items].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const inputCls =
    "rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Consultation Slots <span className="text-ink/40">({items.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => confirm("Reset slots to the demo set?") && reset()}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 hover:bg-ink/5"
        >
          Reset demo
        </button>
      </div>

      {/* add slot */}
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-gold-500/25 bg-white p-4 shadow-card">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Date</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Time</label>
          <input className={inputCls} placeholder="10:30 AM" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-night shadow-gold-btn"
        >
          + Add Slot
        </button>
      </div>

      <ul className="space-y-2.5">
        {sorted.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">
                {fmtDate(s.date)} · {s.time}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                s.booked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {s.booked ? "Booked" : "Available"}
            </span>
            <button type="button" onClick={() => toggleBooked(s.id)} className="rounded-md px-3 py-1.5 text-sm font-medium text-gold-700 hover:bg-gold-100/70">
              {s.booked ? "Free up" : "Block"}
            </button>
            <button type="button" onClick={() => remove(s.id)} className="rounded-md px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50">
              Delete
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/50">
            No slots yet — add one above.
          </li>
        )}
      </ul>
    </div>
  );
}

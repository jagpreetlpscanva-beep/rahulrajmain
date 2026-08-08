"use client";

import { useMemo, useState } from "react";
import { useCollection, DEFAULT_SLOTS, newId, type Slot } from "@/lib/adminStore";

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

// Working hours: 11:00 AM - 2:00 PM and 6:00 PM - 8:00 PM.
// Each slot is 15 minutes + a 5-minute break → slots start every 20 minutes.
function buildDayTimes(): string[] {
  const ranges: [number, number][] = [
    [11 * 60, 14 * 60], // 11:00 AM - 2:00 PM
    [18 * 60, 20 * 60], // 6:00 PM - 8:00 PM
  ];
  const times: string[] = [];
  for (const [start, end] of ranges) {
    for (let mins = start; mins + 15 <= end; mins += 20) {
      const h24 = Math.floor(mins / 60);
      const m = mins % 60;
      const suffix = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 || 12;
      times.push(`${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`);
    }
  }
  return times;
}

const DAY_TIMES = buildDayTimes();

function to12h(t: string) {
  // Accepts "HH:MM" (24h, from <input type="time">) and converts to "hh:mm AM/PM"
  const m = /^(\d{2}):(\d{2})$/.exec(t.trim());
  if (!m) return t.trim();
  let h = parseInt(m[1], 10);
  const min = m[2];
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${min} ${suffix}`;
}

type TypeFilter = "all" | "online" | "offline";

export function SlotsManager() {
  const { items, save, reset } = useCollection<Slot>("slots", DEFAULT_SLOTS);
  const [slotType, setSlotType] = useState<"online" | "offline">("online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<string>("");
  const [genDays, setGenDays] = useState(60);
  const [genOnline, setGenOnline] = useState(true);
  const [genOffline, setGenOffline] = useState(true);

  const norm = (s: Slot): "online" | "offline" => s.type ?? "online";

  // today in local (IST) YYYY-MM-DD — past dates are expired, hide them from the list
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // make sure whatever we just added is actually visible (don't leave the user
  // filtered to the other type / another date, which hides new slots)
  const revealAdded = (d: string) => {
    setTypeFilter(slotType);
    setDateFilter(d);
  };

  const add = () => {
    if (!date) { setFeedback("Please choose a date first."); return; }
    if (!time.trim()) { setFeedback("Please choose a time first."); return; }
    const t = to12h(time);
    if (items.some((s) => s.date === date && s.time === t && norm(s) === slotType)) {
      setFeedback(`That ${slotType} slot (${t}) already exists for this date.`);
      return;
    }
    save([...items, { id: newId("slot"), date, time: t, type: slotType }]);
    setTime("");
    revealAdded(date);
    setFeedback(`✓ Added 1 ${slotType} slot (${t}) for ${date}.`);
  };

  const addFullDay = () => {
    if (!date) { setFeedback("Please choose a date first."); return; }
    // only skip times that already exist for this date AND the SAME type — so an
    // offline full-day still fills in even when online slots exist on that date
    const existingTimes = new Set(
      items.filter((s) => s.date === date && norm(s) === slotType).map((s) => s.time)
    );
    const additions: Slot[] = DAY_TIMES.filter((t) => !existingTimes.has(t)).map((t) => ({
      id: newId("slot"),
      date,
      time: t,
      type: slotType,
    }));
    if (additions.length) {
      save([...items, ...additions]);
      revealAdded(date);
      setFeedback(`✓ Added ${additions.length} ${slotType} slots for ${date}.`);
    } else {
      setFeedback(`All ${slotType} slots for ${date} already exist.`);
    }
  };

  // Bulk-generate slots for the next `genDays` days, for the chosen type(s),
  // using the working-hours grid. Skips any slot (date+time+type) that already
  // exists, so it never duplicates and safely tops up an existing schedule.
  const generateBulk = (daysArg?: number) => {
    const types: ("online" | "offline")[] = [];
    if (genOnline) types.push("online");
    if (genOffline) types.push("offline");
    if (!types.length) { setFeedback("Choose Online and/or Offline first."); return; }
    const days = Math.max(1, Math.min(120, Math.floor(daysArg ?? genDays) || 0));
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const existing = new Set(items.map((s) => `${s.date}|${s.time}|${norm(s)}`));
    const start = new Date(`${todayStr}T00:00:00`);
    const additions: Slot[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      for (const t of DAY_TIMES) {
        for (const ty of types) {
          const key = `${ds}|${t}|${ty}`;
          if (!existing.has(key)) {
            existing.add(key);
            additions.push({ id: newId("slot"), date: ds, time: t, type: ty });
          }
        }
      }
    }
    if (additions.length) {
      save([...items, ...additions]);
      setTypeFilter("all");
      setDateFilter("all");
      setFeedback(`✓ Generated ${additions.length} slots for the next ${days} days (${types.join(" + ")}).`);
    } else {
      setFeedback("All those slots already exist — nothing to add.");
    }
  };

  const remove = (id: string) => save(items.filter((s) => s.id !== id));
  const toggleBooked = (id: string) =>
    save(items.map((s) => (s.id === id ? { ...s, booked: !s.booked } : s)));

  const sorted = useMemo(
    () => [...items].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
    [items]
  );

  const totalSlots = items.length;
  const onlineSlots = items.filter((s) => norm(s) === "online").length;
  const offlineSlots = items.filter((s) => norm(s) === "offline").length;

  const allDates = useMemo(
    () => Array.from(new Set(items.filter((s) => s.date >= todayStr).map((s) => s.date))).sort(),
    [items, todayStr]
  );

  const filtered = sorted.filter((s) => {
    if (s.date < todayStr) return false; // hide expired (past) dates
    if (typeFilter !== "all" && norm(s) !== typeFilter) return false;
    if (dateFilter !== "all" && s.date !== dateFilter) return false;
    return true;
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of filtered) {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const inputCls =
    "rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

  const pillCls = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
      active
        ? "bg-gold-gradient text-night shadow-gold-btn"
        : "border border-ink/15 bg-white text-ink/70 hover:bg-ink/5"
    }`;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Consultation Slots <span className="text-ink/40">({totalSlots})</span>
        </h2>
        <button
          type="button"
          onClick={() => confirm("Reset slots to the demo set?") && reset()}
          className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 hover:bg-ink/5"
        >
          Reset demo
        </button>
      </div>

      {/* stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink/5 text-lg">📅</span>
          <div>
            <p className="text-2xl font-bold text-ink">{totalSlots}</p>
            <p className="text-xs font-medium text-ink/50">Total Slots</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-4 shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-lg">🌐</span>
          <div>
            <p className="text-2xl font-bold text-sky-700">{onlineSlots}</p>
            <p className="text-xs font-medium text-sky-700/70">Online Slots</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 shadow-card">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-lg">📍</span>
          <div>
            <p className="text-2xl font-bold text-rose-700">{offlineSlots}</p>
            <p className="text-xs font-medium text-rose-700/70">Offline Slots</p>
          </div>
        </div>
      </div>

      {/* add slot */}
      <div className="mb-6 rounded-2xl border border-gold-500/25 bg-white p-5 shadow-card">
        <h3 className="font-serif text-lg font-bold text-ink">Time Slot Management</h3>
        <p className="mb-4 text-sm text-ink/50">Add and manage your available consultation slots</p>

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/60">Slot Type</p>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setSlotType("online")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              slotType === "online"
                ? "border-sky-400 bg-sky-50 text-sky-700"
                : "border-ink/15 bg-white text-ink/60 hover:bg-ink/5"
            }`}
          >
            🌐 Online
          </button>
          <button
            type="button"
            onClick={() => setSlotType("offline")}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              slotType === "offline"
                ? "border-rose-400 bg-rose-50 text-rose-700"
                : "border-ink/15 bg-white text-ink/60 hover:bg-ink/5"
            }`}
          >
            📍 Offline
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Date</label>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Time</label>
            <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <button
            type="button"
            onClick={add}
            className="rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-night shadow-gold-btn"
          >
            + Add Slot
          </button>
          <button
            type="button"
            onClick={addFullDay}
            className="rounded-lg border border-ink/15 bg-white px-5 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5"
          >
            Add Full Day
          </button>
        </div>
        {feedback && (
          <p className={`mt-3 text-sm font-medium ${feedback.startsWith("✓") ? "text-emerald-600" : "text-rose-600"}`}>
            {feedback}
          </p>
        )}
      </div>

      {/* bulk generate */}
      <div className="mb-6 rounded-2xl border border-emerald-300/50 bg-emerald-50/40 p-5 shadow-card">
        <h3 className="font-serif text-lg font-bold text-ink">Bulk Generate Slots</h3>
        <p className="mb-4 text-sm text-ink/55">
          Fills 11:00 AM–2:00 PM &amp; 6:00 PM–8:00 PM (15-min slots · 5-min break) for the next N days. Existing slots are skipped.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">Days from today</label>
            <input
              type="number"
              min={1}
              max={120}
              className={inputCls}
              value={genDays}
              onChange={(e) => setGenDays(Number(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-sky-700">
            <input type="checkbox" checked={genOnline} onChange={(e) => setGenOnline(e.target.checked)} /> 🌐 Online
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <input type="checkbox" checked={genOffline} onChange={(e) => setGenOffline(e.target.checked)} /> 📍 Offline
          </label>
          <button
            type="button"
            onClick={() => { setGenDays(60); generateBulk(60); }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Generate 2 Months
          </button>
          <button
            type="button"
            onClick={() => generateBulk()}
            className="rounded-lg border border-emerald-500/50 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Generate {genDays} Days
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTypeFilter("all")} className={pillCls(typeFilter === "all")}>
          All Types
        </button>
        <button type="button" onClick={() => setTypeFilter("online")} className={pillCls(typeFilter === "online")}>
          🌐 Online
        </button>
        <button type="button" onClick={() => setTypeFilter("offline")} className={pillCls(typeFilter === "offline")}>
          📍 Offline
        </button>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setDateFilter("all")} className={pillCls(dateFilter === "all")}>
          All Dates
        </button>
        {allDates.map((d) => (
          <button key={d} type="button" onClick={() => setDateFilter(d)} className={pillCls(dateFilter === d)}>
            {d}
          </button>
        ))}
      </div>

      {/* grouped list */}
      <div className="space-y-4">
        {grouped.map(([d, slots]) => {
          const onlineCount = slots.filter((s) => norm(s) === "online").length;
          const offlineCount = slots.filter((s) => norm(s) === "offline").length;
          return (
            <div key={d} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-100 text-sm">📅</span>
                <p className="font-semibold text-ink">{fmtDate(d)}</p>
                <span className="text-sm text-ink/40">{slots.length} slots</span>
                {onlineCount > 0 && (
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                    {onlineCount} online
                  </span>
                )}
                {offlineCount > 0 && (
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    {offlineCount} offline
                  </span>
                )}
              </div>

              {(() => {
                const off = slots.filter((s) => norm(s) === "offline");
                const on = slots.filter((s) => norm(s) === "online");
                const pill = (s: Slot) => {
                  const isOnline = norm(s) === "online";
                  const tone = s.booked
                    ? "border-rose-300 bg-rose-50 text-rose-700"
                    : isOnline
                    ? "border-sky-300 bg-sky-50 text-sky-800"
                    : "border-amber-400 bg-amber-50 text-amber-800";
                  return (
                    <div key={s.id} className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${tone}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[0.7rem] ${isOnline ? "bg-sky-100" : "bg-amber-100"}`}>{isOnline ? "🌐" : "📍"}</span>
                      <span className="font-semibold">{s.time}</span>
                      {s.booked && <span className="text-xs font-medium">(Booked)</span>}
                      <button type="button" onClick={() => toggleBooked(s.id)} className="ml-1 text-xs font-semibold underline decoration-dotted hover:opacity-70">
                        {s.booked ? "Free up" : "Disable"}
                      </button>
                      <button type="button" onClick={() => remove(s.id)} className="text-rose-500 hover:text-rose-700" aria-label="Delete slot">🗑</button>
                    </div>
                  );
                };
                return (
                  <div className="space-y-3">
                    {off.length > 0 && (
                      <div className="rounded-xl bg-amber-50/50 p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">📍 Offline · {off.length} slots</p>
                        <div className="flex flex-wrap gap-2">{off.map(pill)}</div>
                      </div>
                    )}
                    {on.length > 0 && (
                      <div className="rounded-xl bg-sky-50/50 p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-sky-700">🌐 Online · {on.length} slots</p>
                        <div className="flex flex-wrap gap-2">{on.map(pill)}</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}

        {grouped.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/50">
            No slots match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

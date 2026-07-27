"use client";

/**
 * Planet-wise remedies manager for the Prescription Pad admin.
 *
 * Shows a collapsible accordion of categories (9 planets + लग्न + Miscellaneous).
 * Only the category list is shown by default; tapping a category opens ONLY that
 * category's remedies with per-category Search, Add, Edit, Delete, drag-and-drop
 * Reorder and Enable/Disable. Every remedy stays linked to its own category:
 * planet/लग्न remedies live in `planetRemedies` (matched by the `planet` field),
 * Miscellaneous remedies live in `miscRemedies`. Mobile-first.
 */

import { useState } from "react";
import { newId, type PlanetRemedy, type MiscRemedy } from "@/lib/cms";

type Coll<T> = { items: T[]; save: (n: T[]) => void };
type AnyRemedy = { id: string; title: string; enabled?: boolean; planet?: string };
type Cat = { key: string; label: string };

/** The special category whose remedies live in `miscRemedies`. */
const MISC_KEY = "Miscellaneous";

/** Built-in categories used only when none are configured in admin. */
const FALLBACK_CATS: Cat[] = [
  { key: "Sun", label: "सूर्य" }, { key: "Moon", label: "चंद्र" }, { key: "Mars", label: "मंगल" },
  { key: "Mercury", label: "बुध" }, { key: "Jupiter", label: "गुरु" }, { key: "Venus", label: "शुक्र" },
  { key: "Saturn", label: "शनि" }, { key: "Rahu", label: "राहु" }, { key: "Ketu", label: "केतु" },
  { key: "Lagna", label: "लग्न" }, { key: MISC_KEY, label: "विशेष उपाय" },
];

const inputCls =
  "w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20";

export function PlanetRemediesManager({ planet, misc, categories }: { planet: Coll<PlanetRemedy>; misc: Coll<MiscRemedy>; categories?: { key: string; title: string; enabled?: boolean }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draftId, setDraftId] = useState<string | null | undefined>(undefined); // undefined = closed, null = adding, string = editing id
  const [draftText, setDraftText] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // admin-configured categories (enabled only), else the built-in list
  const cats: Cat[] = categories && categories.length
    ? categories.filter((c) => c.enabled !== false && c.key).map((c) => ({ key: c.key, label: c.title || c.key }))
    : FALLBACK_CATS;

  const isMisc = open === MISC_KEY;
  const countFor = (key: string) => (key === MISC_KEY ? misc.items.length : planet.items.filter((r) => r.planet === key).length);
  const catItems: AnyRemedy[] = open == null ? [] : isMisc ? misc.items : planet.items.filter((r) => r.planet === open);

  const closeEditor = () => { setDraftId(undefined); setDraftText(""); };
  const toggleCat = (key: string) => { setOpen((o) => (o === key ? null : key)); setQuery(""); closeEditor(); };
  const startAdd = () => { setDraftId(null); setDraftText(""); };
  const startEdit = (it: AnyRemedy) => { setDraftId(it.id); setDraftText(it.title); };

  const saveDraft = () => {
    const text = draftText.trim();
    if (!text || open == null) return;
    if (isMisc) {
      if (draftId == null) misc.save([...misc.items, { id: newId("rem"), title: text, enabled: true }]);
      else misc.save(misc.items.map((r) => (r.id === draftId ? { ...r, title: text } : r)));
    } else {
      if (draftId == null) planet.save([...planet.items, { id: newId("rem"), planet: open, title: text, enabled: true }]);
      else planet.save(planet.items.map((r) => (r.id === draftId ? { ...r, title: text } : r)));
    }
    closeEditor();
  };

  const del = (id: string) => {
    if (!confirm("यह उपाय हटाएं? / Delete this remedy?")) return;
    if (isMisc) misc.save(misc.items.filter((r) => r.id !== id));
    else planet.save(planet.items.filter((r) => r.id !== id));
    if (draftId === id) closeEditor();
  };

  const toggleEnabled = (id: string) => {
    if (isMisc) misc.save(misc.items.map((r) => (r.id === id ? { ...r, enabled: r.enabled === false } : r)));
    else planet.save(planet.items.map((r) => (r.id === id ? { ...r, enabled: r.enabled === false } : r)));
  };

  /** Reorder within the open category only (indices are positions in catItems, query empty). */
  const reorder = (from: number, to: number) => {
    if (from === to || open == null) return;
    if (isMisc) {
      const next = [...misc.items];
      const [m] = next.splice(from, 1); next.splice(to, 0, m);
      misc.save(next);
    } else {
      const positions: number[] = [];
      planet.items.forEach((r, idx) => { if (r.planet === open) positions.push(idx); });
      const subset = positions.map((p) => planet.items[p]);
      const [m] = subset.splice(from, 1); subset.splice(to, 0, m);
      const next = [...planet.items];
      positions.forEach((pos, i) => { next[pos] = subset[i]; });
      planet.save(next);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = q ? catItems.filter((r) => r.title.toLowerCase().includes(q)) : catItems;
  const canReorder = !q;

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">उपचार — ग्रह अनुसार</h2>
        <p className="mt-0.5 text-xs text-ink/55">किसी ग्रह पर टैप करें — उसी के उपाय खुलेंगे। हर उपाय अपने ग्रह से जुड़ा रहता है।</p>
      </div>

      <ul className="space-y-2">
        {cats.map((cat) => {
          const isOpen = open === cat.key;
          return (
            <li key={cat.key} className="overflow-hidden rounded-xl border border-ink/12 bg-white shadow-sm">
              {/* accordion header */}
              <button
                type="button"
                onClick={() => toggleCat(cat.key)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left ${isOpen ? "bg-[#8a2020]/5" : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="font-serif text-lg font-bold text-[#8a2020]">{cat.label}</span>
                  <span className="rounded-full bg-ink/8 px-2 py-0.5 text-xs font-semibold text-ink/55">{countFor(cat.key)}</span>
                </span>
                <span className={`text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {/* panel */}
              {isOpen && (
                <div className="border-t border-ink/10 p-3 sm:p-4">
                  {/* search + add */}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`${cat.label} के उपाय खोजें…`}
                      className={inputCls}
                    />
                    {draftId === undefined && (
                      <button type="button" onClick={startAdd} className="shrink-0 rounded-lg bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-night shadow-gold-btn">
                        + Add Remedy
                      </button>
                    )}
                  </div>

                  {/* inline editor */}
                  {draftId !== undefined && (
                    <div className="mt-3 rounded-xl border border-gold-500/30 bg-gold-50/40 p-3">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
                        {draftId == null ? `Add remedy — ${cat.label}` : "Edit remedy"}
                      </label>
                      <textarea rows={2} value={draftText} onChange={(e) => setDraftText(e.target.value)} className={inputCls} placeholder="उपाय लिखें… (जैसे: आदित्य हृदय स्तोत्र का पाठ करें)" />
                      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" onClick={closeEditor} className="w-full rounded-lg border border-ink/15 px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 sm:w-auto">Cancel</button>
                        <button type="button" onClick={saveDraft} className="w-full rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-night shadow-gold-btn sm:w-auto">Save</button>
                      </div>
                    </div>
                  )}

                  {/* list */}
                  <ul className="mt-3 space-y-2">
                    {shown.length === 0 && (
                      <li className="rounded-lg border border-dashed border-ink/15 p-5 text-center text-sm text-ink/45">
                        {q ? "कोई उपाय नहीं मिला।" : "अभी कोई उपाय नहीं — “Add Remedy” दबाएं।"}
                      </li>
                    )}
                    {shown.map((r) => {
                      const i = catItems.indexOf(r);
                      const disabled = r.enabled === false;
                      return (
                        <li
                          key={r.id}
                          draggable={canReorder}
                          onDragStart={() => setDragIndex(i)}
                          onDragOver={(e) => { if (dragIndex !== null) e.preventDefault(); }}
                          onDrop={() => { if (dragIndex !== null) reorder(dragIndex, i); setDragIndex(null); }}
                          onDragEnd={() => setDragIndex(null)}
                          className={`flex flex-wrap items-center gap-2 rounded-xl border border-ink/10 bg-white p-3 shadow-sm ${canReorder ? "cursor-move" : ""} ${dragIndex === i ? "opacity-50" : ""} ${disabled ? "opacity-60" : ""}`}
                        >
                          {canReorder && <span className="select-none px-1 text-lg leading-none text-ink/30" aria-hidden title="Drag to reorder">⠿</span>}
                          <p className={`min-w-0 flex-1 basis-[55%] break-words text-sm ${disabled ? "text-ink/45 line-through" : "text-ink"}`}>{r.title}</p>
                          <div className="ml-auto flex w-full items-center justify-end gap-1 sm:w-auto">
                            <button
                              type="button"
                              onClick={() => toggleEnabled(r.id)}
                              title={disabled ? "Enable" : "Disable"}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${disabled ? "border-ink/15 text-ink/45" : "border-emerald-500/40 bg-emerald-50 text-emerald-700"}`}
                            >
                              <span className={`grid h-4 w-7 items-center rounded-full px-0.5 ${disabled ? "bg-ink/20" : "bg-emerald-500"}`}>
                                <span className={`h-3 w-3 rounded-full bg-white transition-transform ${disabled ? "" : "translate-x-3"}`} />
                              </span>
                              {disabled ? "Off" : "On"}
                            </button>
                            <button type="button" onClick={() => startEdit(r)} className="rounded-md px-3 py-2 text-sm font-medium text-gold-700 hover:bg-gold-100/70">Edit</button>
                            <button type="button" onClick={() => del(r.id)} className="rounded-md px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">Delete</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

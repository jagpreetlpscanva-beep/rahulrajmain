"use client";

import { useState } from "react";
import { useCollection, DEFAULT_REVIEWS, type Review } from "@/lib/adminStore";

const STATUS_STYLE: Record<Review["status"], string> = {
  approved: "bg-emerald-100 text-emerald-700 border-emerald-300",
  pending: "bg-amber-100 text-amber-700 border-amber-300",
  rejected: "bg-rose-100 text-rose-700 border-rose-300",
};

function fmtDate(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export function ReviewsManager() {
  const { items, save } = useCollection<Review>("reviews", DEFAULT_REVIEWS);
  const [filter, setFilter] = useState<"all" | Review["status"]>("all");
  const [editing, setEditing] = useState<Review | null>(null);

  const count = (s: Review["status"]) => items.filter((r) => r.status === s).length;
  const visible = filter === "all" ? items : items.filter((r) => r.status === filter);

  const update = (id: string, patch: Partial<Review>) => save(items.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => {
    if (confirm("Delete this review? This cannot be undone.")) save(items.filter((r) => r.id !== id));
  };
  const saveEdit = () => {
    if (!editing) return;
    save(items.map((r) => (r.id === editing.id ? editing : r)));
    setEditing(null);
  };

  const tabs: { key: "all" | Review["status"]; label: string; n: number }[] = [
    { key: "all", label: "All Reviews", n: items.length },
    { key: "pending", label: "Pending", n: count("pending") },
    { key: "approved", label: "Approved", n: count("approved") },
    { key: "rejected", label: "Rejected", n: count("rejected") },
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Reviews Management</h2>
      <p className="mt-1 text-sm text-ink/55">Approve, reject, edit, feature or delete customer reviews.</p>

      {/* filter tabs */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              filter === t.key ? "bg-gold-gradient text-night shadow-gold-btn" : "border border-ink/15 text-ink/70 hover:bg-ink/5"
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">{t.n}</span>
          </button>
        ))}
      </div>

      {/* table */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/55">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">
                      {r.initials || r.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="font-semibold text-ink">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-luxe-gold">{"★".repeat(r.rating)}<span className="text-ink/20">{"★".repeat(5 - r.rating)}</span></td>
                <td className="max-w-[22rem] px-4 py-3 text-ink/70">
                  <span className="line-clamp-2">{r.text}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => update(r.id, { status: e.target.value as Review["status"] })}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${STATUS_STYLE[r.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => update(r.id, { featured: !r.featured })}
                    aria-label="Toggle featured"
                    className={`grid h-8 w-8 place-items-center rounded-full ${r.featured ? "text-luxe-gold" : "text-ink/25 hover:text-ink/50"}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" /></svg>
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/55">{fmtDate(r.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => update(r.id, { status: "rejected" })} title="Reject" className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">✕</button>
                    <button onClick={() => setEditing(r)} title="Edit" className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">✎</button>
                    <button onClick={() => remove(r.id)} title="Delete" className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-ink/50">No reviews here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-lg font-bold text-ink">Edit review</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Name" />
              <input className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="Location (optional)" />
              <div className="flex items-center gap-2 text-sm">
                <span>Rating:</span>
                <input type="number" min={1} max={5} className="w-16 rounded-lg border border-ink/15 px-2 py-1" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })} />
              </div>
              <textarea rows={4} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-lg border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:bg-ink/5">Cancel</button>
              <button onClick={saveEdit} className="rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-night shadow-gold-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

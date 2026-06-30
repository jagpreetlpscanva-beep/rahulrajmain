"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/lib/bookings";

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

const STATUS_STYLE: Record<Booking["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = () => {
    fetch("/api/bookings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  };
  useEffect(load, []);

  const setStatus = async (id: string, status: Booking["status"]) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    setBookings((bs) => bs.filter((b) => b.id !== id));
    await fetch("/api/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Bookings <span className="text-ink/40">({bookings.length})</span>
        </h2>
        <button type="button" onClick={load} className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 hover:bg-ink/5">
          Refresh
        </button>
      </div>

      {!loaded ? (
        <p className="text-ink/50">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/50">
          No bookings yet. They&rsquo;ll appear here when customers book.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Booked</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {bookings.map((b) => (
                <tr key={b.id} className="text-ink/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{b.name}</p>
                    <p className="text-xs text-ink/55">{b.phone}{b.email ? ` · ${b.email}` : ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.itemTitle || b.itemType}</p>
                    <p className="text-xs capitalize text-ink/50">
                      {b.itemType}
                      {b.paymentMethod === "cash" ? " · 💵 cash on day" : b.paid ? " · 💳 paid online" : ""}
                    </p>
                    {b.coupon && <p className="text-xs font-medium text-emerald-600">🎟 {b.coupon}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {b.slotDate ? `${b.slotDate}, ${b.slotTime}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold">{b.amount || "—"}</td>
                  <td className="px-4 py-3 text-xs text-ink/55">{fmt(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b.id, e.target.value as Booking["status"])}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[b.status]}`}
                    >
                      <option value="new">new</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => remove(b.id)} className="rounded-md px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

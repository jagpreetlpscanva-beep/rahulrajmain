"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/lib/messages";

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function MessagesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = () => {
    fetch("/api/messages", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setMessages(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  };
  useEffect(load, []);

  const setStatus = async (id: string, status: ContactMessage["status"]) => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m)));
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    setMessages((ms) => ms.filter((m) => m.id !== id));
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Messages <span className="text-ink/40">({messages.length})</span>
          {newCount > 0 && (
            <span className="ml-2 rounded-full bg-rose-500 px-2 py-0.5 align-middle text-xs font-bold text-white">
              {newCount} new
            </span>
          )}
        </h2>
        <button type="button" onClick={load} className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 hover:bg-ink/5">
          Refresh
        </button>
      </div>

      {!loaded ? (
        <p className="text-ink/50">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/50">
          No messages yet. Contact-form enquiries will appear here.
        </p>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                m.status === "new" ? "border-rose-300 ring-1 ring-rose-200" : "border-ink/10"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    {m.name}
                    {m.status === "new" && (
                      <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-white">New</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/55">
                    {[m.email, m.phone].filter(Boolean).join(" · ") || "No contact details"}
                  </p>
                </div>
                <span className="text-xs text-ink/45">{fmt(m.createdAt)}</span>
              </div>

              {m.subject && (
                <p className="mt-3 text-sm font-semibold text-ink/80">Re: {m.subject}</p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {m.status === "new" ? (
                  <button type="button" onClick={() => setStatus(m.id, "read")} className="rounded-lg bg-gold-gradient px-3 py-1.5 text-xs font-semibold text-night shadow-gold-btn">
                    Mark as read
                  </button>
                ) : (
                  <button type="button" onClick={() => setStatus(m.id, "new")} className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-ink/5">
                    Mark unread
                  </button>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} className="rounded-lg border border-gold-500/30 px-3 py-1.5 text-xs font-medium text-gold-700 hover:bg-gold-50">
                    Reply by email
                  </a>
                )}
                {m.phone && (
                  <a href={`https://wa.me/${m.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
                    WhatsApp
                  </a>
                )}
                <button type="button" onClick={() => remove(m.id)} className="ml-auto rounded-md px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

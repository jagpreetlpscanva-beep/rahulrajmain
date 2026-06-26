"use client";

import { useState } from "react";
import {
  useCollection,
  DEFAULT_REPORTS,
  DEFAULT_COURSES,
  DEFAULT_POOJAS,
  DEFAULT_CONSULTATIONS,
  type StoredReport,
  type Course,
  type Pooja,
  type Consultation,
} from "@/lib/adminStore";

type Result = { title: string; type: string; href: string };

export function SearchBox({ scrolled, inline = false }: { scrolled?: boolean; inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const reports = useCollection<StoredReport>("reports", DEFAULT_REPORTS).items;
  const courses = useCollection<Course>("courses", DEFAULT_COURSES).items;
  const poojas = useCollection<Pooja>("poojas", DEFAULT_POOJAS).items;
  const consults = useCollection<Consultation>("consultations", DEFAULT_CONSULTATIONS).items;

  const query = q.trim().toLowerCase();
  const has = (s: string) => s.toLowerCase().includes(query);
  const results: Result[] = query
    ? [
        ...reports.filter((r) => has(r.title)).map((r) => ({ title: r.title, type: "Report", href: "/reports" })),
        ...courses.filter((c) => has(c.title)).map((c) => ({ title: c.title, type: "Course", href: "/courses" })),
        ...poojas.filter((p) => has(p.title)).map((p) => ({ title: p.title, type: "Pooja", href: `/book/pooja/${p.id}` })),
        ...consults.filter((c) => has(c.title)).map((c) => ({ title: c.title, type: "Consultation", href: "/consultation" })),
      ].slice(0, 8)
    : [];

  // inline: always-visible search input (used in the mobile menu)
  if (inline) {
    return (
      <div>
        <div className="relative">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reports, courses, poojas…"
            className="w-full rounded-lg border border-ink/15 bg-[#fbf7ee] py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-gold-500"
          />
        </div>
        {query && (
          <ul className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-ink/10 bg-white">
            {results.length === 0 ? (
              <li className="px-3 py-3 text-center text-sm text-ink/50">No matches for “{q}”.</li>
            ) : (
              results.map((r, i) => (
                <li key={i}>
                  <a href={r.href} className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-gold-100/70">
                    <span className="truncate font-medium text-ink">{r.title}</span>
                    <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-700">{r.type}</span>
                  </a>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Search"
        className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
          scrolled ? "border-ink/20 text-ink/70 hover:bg-ink/5" : "border-cream/45 text-cream hover:bg-white/10"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-xl bg-white p-3 shadow-[0_26px_60px_-15px_rgba(45,27,18,0.5)] ring-1 ring-ink/10">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search reports, courses, poojas…"
                className="w-full rounded-lg border border-ink/15 bg-[#fbf7ee] py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-gold-500"
              />
            </div>
            {query && (
              <ul className="mt-2 max-h-72 overflow-y-auto">
                {results.length === 0 ? (
                  <li className="px-2 py-4 text-center text-sm text-ink/50">No matches for “{q}”.</li>
                ) : (
                  results.map((r, i) => (
                    <li key={i}>
                      <a
                        href={r.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gold-100/70"
                      >
                        <span className="truncate font-medium text-ink">{r.title}</span>
                        <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-700">{r.type}</span>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

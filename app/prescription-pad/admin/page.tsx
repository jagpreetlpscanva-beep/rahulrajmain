"use client";

/**
 * Mobile-friendly admin for EVERYTHING on the Prescription Pad.
 * Reuses the same content API + CollectionManager as the main /admin panel, so
 * edits here show up on the pad instantly. Drag & drop reorder, enable/disable
 * and full CRUD are all provided by CollectionManager.
 */

import { useEffect, useState, type FormEvent } from "react";
import { useCollection, newId } from "@/lib/adminStore";
import {
  PLANETS,
  DEFAULT_PLANET_REMEDIES, type PlanetRemedy,
  DEFAULT_MISC_REMEDIES, type MiscRemedy,
  DEFAULT_REMEDY_COUNTS, type RemedyCountOption,
  DEFAULT_GEMSTONES, type Gemstone,
  DEFAULT_ANUSHTHAN, type Anushthan,
  DEFAULT_PAD_SECTIONS, type PadSection,
  DEFAULT_GEM_GRADES, type GemGrade,
  DEFAULT_CARATS, type CaratOption,
} from "@/lib/cms";
import { CollectionManager, type FieldDef } from "../../components/admin/CollectionManager";

/* ---------------- field definitions (mirror the main admin) ---------------- */
const remedyFields: FieldDef[] = [
  { name: "planet", label: "Planet", type: "select", options: [...PLANETS] },
  { name: "title", label: "Remedy (upay)", type: "textarea", hint: "English is auto-shown in Hindi on the pad; or type Hindi directly." },
];
const miscRemedyFields: FieldDef[] = [
  { name: "title", label: "Remedy (upay)", type: "textarea" },
];
const remedyCountFields: FieldDef[] = [
  { name: "title", label: "Count / Frequency", type: "text", placeholder: "e.g. 11 or 21" },
];
const gemstoneFields: FieldDef[] = [
  { name: "planet", label: "Planet", type: "select", options: [...PLANETS] },
  { name: "stone", label: "Stone", type: "text", placeholder: "Blue Sapphire (Neelam)" },
  { name: "weight", label: "Weight", type: "text", placeholder: "7 Ratti" },
  { name: "metal", label: "Metal", type: "text", placeholder: "Silver" },
  { name: "finger", label: "Finger", type: "text", placeholder: "Middle Finger" },
  { name: "day", label: "Day", type: "text", placeholder: "Saturday" },
  { name: "mantra", label: "Mantra", type: "text", placeholder: "Om Sham Shanicharaya Namah" },
  { name: "rateA", label: "Rate — Grade A (₹/Ratti)", type: "number", optional: true, hint: "Price = carat × rate." },
  { name: "rateB", label: "Rate — Grade B (₹/Ratti)", type: "number", optional: true },
  { name: "rateC", label: "Rate — Grade C (₹/Ratti)", type: "number", optional: true },
];
const anushthanFields: FieldDef[] = [
  { name: "title", label: "Anushthan (English or Hindi)", type: "text", placeholder: "Rahu Jap", hint: "English auto-shows in Hindi on the pad (Rahu Jap → राहु जाप)." },
  { name: "titleHi", label: "Hindi override", type: "text", optional: true, placeholder: "राहु जाप" },
  { name: "purpose", label: "Purpose (उद्देश्य)", type: "text", placeholder: "18,000 Jap" },
  { name: "dakshina", label: "Dakshina (दक्षिणा)", type: "text", placeholder: "₹7,000" },
];
const caratFields: FieldDef[] = [{ name: "title", label: "Carat / Ratti", type: "text", placeholder: "7" }];
const gemGradeFields: FieldDef[] = [{ name: "title", label: "Grade label", type: "text", placeholder: "A", hint: "1st grade → Rate A, 2nd → B, 3rd → C." }];
const padSectionFields: FieldDef[] = [
  { name: "title", label: "Section heading", type: "text", hint: "Drag rows to reorder. (Anushthan only uses the heading + column labels.)" },
  { name: "enabled", label: "Show this section", type: "toggle" },
  { name: "col1", label: "Column 1 label", type: "text", optional: true },
  { name: "col2", label: "Column 2 label", type: "text", optional: true },
  { name: "col3", label: "Column 3 label", type: "text", optional: true },
];

const blankRemedy = (): PlanetRemedy => ({ id: newId("rem"), planet: "Saturn", title: "" });
const blankMisc = (): MiscRemedy => ({ id: newId("rem"), title: "" });
const blankCount = (): RemedyCountOption => ({ id: newId("count"), title: "" });
const blankGem = (): Gemstone => ({ id: newId("gem"), planet: "Saturn", title: "New Gemstone", stone: "", weight: "", metal: "", finger: "", day: "", mantra: "", rateA: 0, rateB: 0, rateC: 0 });
const blankAnu = (): Anushthan => ({ id: newId("anu"), title: "", purpose: "", dakshina: "", titleHi: "" });
const blankCarat = (): CaratOption => ({ id: newId("carat"), title: "" });
const blankGrade = (): GemGrade => ({ id: newId("grade"), title: "" });
const blankSection = (): PadSection => ({ id: newId("sec"), title: "", enabled: true });

type TabKey = "remedies" | "anushthan" | "gemstones" | "misc" | "layout";
const TABS: { key: TabKey; label: string }[] = [
  { key: "remedies", label: "Remedies" },
  { key: "anushthan", label: "Anushthan" },
  { key: "gemstones", label: "Gemstones" },
  { key: "misc", label: "Misc & Counts" },
  { key: "layout", label: "Print Layout" },
];

export default function PrescriptionAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<TabKey>("remedies");

  const remedies = useCollection<PlanetRemedy>("planetRemedies", DEFAULT_PLANET_REMEDIES);
  const anushthan = useCollection<Anushthan>("anushthan", DEFAULT_ANUSHTHAN);
  const gemstones = useCollection<Gemstone>("gemstones", DEFAULT_GEMSTONES);
  const misc = useCollection<MiscRemedy>("miscRemedies", DEFAULT_MISC_REMEDIES);
  const counts = useCollection<RemedyCountOption>("remedyCounts", DEFAULT_REMEDY_COUNTS);
  const carats = useCollection<CaratOption>("carats", DEFAULT_CARATS);
  const grades = useCollection<GemGrade>("gemGrades", DEFAULT_GEM_GRADES);
  const sections = useCollection<PadSection>("padSections", DEFAULT_PAD_SECTIONS);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setUnlocked(Boolean(d.authed)))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      if (res.ok) { setUnlocked(true); setPass(""); }
      else { const d = await res.json().catch(() => ({})); setError(d.error || "Incorrect username or password"); }
    } catch { setError("Could not reach the server"); }
    finally { setBusy(false); }
  };

  if (!unlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#1f1b44] px-5">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
          <h1 className="text-center font-serif text-xl font-bold text-ink">Prescription Pad — Admin</h1>
          <label className="mt-6 block text-sm font-semibold text-ink/70">Username</label>
          <input autoFocus value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-[#6b3fa0]" />
          <label className="mt-4 block text-sm font-semibold text-ink/70">Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="mt-1 w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-[#6b3fa0]" />
          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
          <button type="submit" disabled={busy} className="mt-6 w-full rounded-xl bg-[#1f1b44] py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Signing in…" : "Sign In"}</button>
          {checked && <a href="/prescription-pad" className="mt-4 block text-center text-xs text-ink/50 hover:text-ink">← Back to Pad</a>}
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* sticky mobile header + scrollable tabs */}
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-[#1f1b44] text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-serif text-lg font-bold">📝 Pad Admin</span>
          <a href="/prescription-pad" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold">Open Pad ↗</a>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-3 pb-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${tab === t.key ? "bg-[#f97316] text-white" : "bg-white/10 text-white/75"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl p-4 sm:p-6">
        {tab === "remedies" && (
          <CollectionManager<PlanetRemedy> label="Planet Remedies" items={remedies.items} fields={remedyFields} blank={blankRemedy} onChange={remedies.save} onReset={remedies.reset} previewHref="/prescription-pad" />
        )}
        {tab === "anushthan" && (
          <CollectionManager<Anushthan> label="Anushthan" items={anushthan.items} fields={anushthanFields} blank={blankAnu} onChange={anushthan.save} onReset={anushthan.reset} previewHref="/prescription-pad" />
        )}
        {tab === "gemstones" && (
          <div className="space-y-8">
            <CollectionManager<Gemstone> label="Gemstones" items={gemstones.items} fields={gemstoneFields} blank={blankGem} onChange={gemstones.save} onReset={gemstones.reset} previewHref="/prescription-pad" />
            <CollectionManager<CaratOption> label="Carat Options" items={carats.items} fields={caratFields} blank={blankCarat} onChange={carats.save} onReset={carats.reset} previewHref="/prescription-pad" />
            <CollectionManager<GemGrade> label="Gem Grades" items={grades.items} fields={gemGradeFields} blank={blankGrade} onChange={grades.save} onReset={grades.reset} previewHref="/prescription-pad" />
          </div>
        )}
        {tab === "misc" && (
          <div className="space-y-8">
            <CollectionManager<MiscRemedy> label="Miscellaneous Remedies" items={misc.items} fields={miscRemedyFields} blank={blankMisc} onChange={misc.save} onReset={misc.reset} previewHref="/prescription-pad" />
            <CollectionManager<RemedyCountOption> label="Remedy Counts / Frequency" items={counts.items} fields={remedyCountFields} blank={blankCount} onChange={counts.save} onReset={counts.reset} previewHref="/prescription-pad" />
          </div>
        )}
        {tab === "layout" && (
          <div className="space-y-4">
            <CollectionManager<PadSection> label="Print Sections (drag to reorder)" items={sections.items} fields={padSectionFields} blank={blankSection} onChange={sections.save} onReset={sections.reset} previewHref="/prescription-pad" />
            <p className="rounded-xl border border-dashed border-ink/15 bg-white p-4 text-xs leading-relaxed text-ink/55">
              <b>Dasha / Yog / Dosh</b> are auto-generated from each patient&rsquo;s birth chart and can be
              edited per-consultation directly on the pad — there is no separate list to manage here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

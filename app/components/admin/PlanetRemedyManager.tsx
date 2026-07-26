"use client";

import { useState } from "react";
import { CollectionManager, type FieldDef } from "./CollectionManager";
import {
  newId,
  DEFAULT_PLANET_REMEDIES, type PlanetRemedy,
  type MiscRemedy,
} from "@/lib/cms";

/**
 * Planet-wise remedies manager (उपचार). Shows a collapsed accordion of
 * categories; opening one reveals ONLY that planet's remedies with full
 * Search / Add / Edit / Delete / Drag-reorder / Enable-Disable (via the reused
 * mobile-friendly CollectionManager). Every remedy stays linked to its planet.
 */

type Cat = { key: string; label: string; misc?: boolean };
const CATEGORIES: Cat[] = [
  { key: "Sun", label: "सूर्य" },
  { key: "Moon", label: "चंद्र" },
  { key: "Mars", label: "मंगल" },
  { key: "Mercury", label: "बुध" },
  { key: "Jupiter", label: "गुरु" },
  { key: "Venus", label: "शुक्र" },
  { key: "Saturn", label: "शनि" },
  { key: "Rahu", label: "राहु" },
  { key: "Ketu", label: "केतु" },
  { key: "Lagna", label: "लग्न" },
  { key: "Miscellaneous", label: "Miscellaneous", misc: true },
];

const remedyFields: FieldDef[] = [
  { name: "title", label: "Remedy (upay)", type: "textarea", hint: "English auto-shows in Hindi on the pad, or type Hindi directly." },
  { name: "enabled", label: "Show on pad", type: "toggle" },
];

/** ensure legacy rows (no `enabled`) show as enabled in the editor/list */
const withEnabled = <T extends { enabled?: boolean }>(x: T): T => ({ ...x, enabled: x.enabled !== false });

interface Props {
  planetItems: PlanetRemedy[];
  onPlanetChange: (next: PlanetRemedy[]) => void;
  includeMisc?: boolean;
  miscItems?: MiscRemedy[];
  onMiscChange?: (next: MiscRemedy[]) => void;
  onMiscReset?: () => void;
}

export function PlanetRemedyManager({ planetItems, onPlanetChange, includeMisc = true, miscItems = [], onMiscChange, onMiscReset }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const cats = includeMisc ? CATEGORIES : CATEGORIES.filter((c) => !c.misc);

  const countFor = (c: Cat) => (c.misc ? miscItems.length : planetItems.filter((p) => p.planet === c.key).length);

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-ink sm:text-2xl">उपचार — ग्रह अनुसार</h2>
        <p className="mt-1 text-sm text-ink/55">किसी ग्रह पर टैप करें और उसी के उपाय जोड़ें/बदलें।</p>
      </div>

      <ul className="space-y-2.5">
        {cats.map((c) => {
          const isOpen = open === c.key;
          return (
            <li key={c.key} className="overflow-hidden rounded-xl border border-ink/12 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.key)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left ${isOpen ? "bg-[#8a2020]/5" : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="font-serif text-lg font-bold text-[#8a2020]">{c.label}</span>
                  <span className="rounded-full bg-ink/8 px-2 py-0.5 text-xs font-semibold text-ink/55">{countFor(c)}</span>
                </span>
                <span className={`text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
              </button>

              {isOpen && (
                <div className="border-t border-ink/10 p-3 sm:p-4">
                  {c.misc ? (
                    <CollectionManager<MiscRemedy>
                      label="Miscellaneous"
                      items={miscItems.map(withEnabled)}
                      fields={remedyFields}
                      blank={() => ({ id: newId("rem"), title: "", enabled: true })}
                      onChange={(next) => onMiscChange?.(next)}
                      onReset={() => onMiscReset?.()}
                      previewHref="/prescription-pad"
                    />
                  ) : (
                    <CollectionManager<PlanetRemedy>
                      label={`${c.label} उपाय`}
                      items={planetItems.filter((p) => p.planet === c.key).map(withEnabled)}
                      fields={remedyFields}
                      blank={() => ({ id: newId("rem"), planet: c.key, title: "", enabled: true })}
                      onChange={(next) => onPlanetChange([...planetItems.filter((p) => p.planet !== c.key), ...next])}
                      onReset={() => onPlanetChange([
                        ...planetItems.filter((p) => p.planet !== c.key),
                        ...DEFAULT_PLANET_REMEDIES.filter((p) => p.planet === c.key).map(withEnabled),
                      ])}
                      previewHref="/prescription-pad"
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

/**
 * Prescription Module entry — a premium selection screen with three options.
 * Basic Kundali opens the EXISTING prescription pad unchanged; the two new
 * workflows (Kundali Milan, Birth Child Kundali) open their own screens.
 */

import { useState } from "react";
import { PrescriptionPad } from "./PrescriptionPad";
import { KundaliMilan } from "./KundaliMilan";
import { BirthChildKundali } from "./BirthChildKundali";

type View = "select" | "basic" | "milan" | "child";

const CARDS: { key: Exclude<View, "select">; icon: string; title: string; desc: string; accent: [string, string] }[] = [
  { key: "basic", icon: "🕉", title: "बेसिक कुंडली", desc: "सामान्य प्रिस्क्रिप्शन पैड — कुंडली, दशा, उपाय, रत्न व प्रिंट।", accent: ["#123a63", "#0b2540"] },
  { key: "milan", icon: "💍", title: "कुंडली मिलान", desc: "लड़का-लड़की का अष्टकूट गुण मिलान (36 अंक) व अनुकूलता रिपोर्ट।", accent: ["#7a1330", "#4e0c1f"] },
  { key: "child", icon: "👶", title: "बाल जन्म कुंडली", desc: "नवजात शिशु की जन्म कुंडली, विवरण व उपाय।", accent: ["#123a63", "#0b2540"] },
];

export function PrescriptionModule() {
  const [view, setView] = useState<View>("select");
  const back = () => setView("select");

  if (view === "basic") {
    return (
      <div>
        <div className="mx-auto flex max-w-[1120px] px-3 pt-3">
          <button onClick={back} className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink/70 shadow-sm">← विकल्प स्क्रीन</button>
        </div>
        <PrescriptionPad />
      </div>
    );
  }
  if (view === "milan") return <KundaliMilan onBack={back} />;
  if (view === "child") return <BirthChildKundali onBack={back} />;

  return (
    <div className="min-h-screen bg-[#f4eee3]">
      <div className="mx-auto max-w-[1120px] px-4 py-10">
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl font-extrabold text-[#a01414] sm:text-4xl">प्रिस्क्रिप्शन मॉड्यूल</p>
          <p className="mt-2 text-sm text-ink/55">नीचे से एक विकल्प चुनें</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setView(c.key)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 p-6 text-left shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: `linear-gradient(160deg, ${c.accent[0]}, ${c.accent[1]})` }}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-opacity group-hover:opacity-80" />
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-4xl">{c.icon}</div>
              <p className="font-serif text-2xl font-bold text-amber-100">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-300/90 px-4 py-1.5 text-sm font-bold text-[#4e0c1f]">
                खोलें <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

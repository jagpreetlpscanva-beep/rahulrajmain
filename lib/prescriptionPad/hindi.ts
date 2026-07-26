/**
 * English → Hindi display helper for the Prescription Pad.
 *
 * Admin data may be typed in English (e.g. "Rahu Jap"); the pad and the PDF must
 * show the Hindi form ("राहु जाप"). `toHindi()` maps each word using the
 * astrology dictionary below and leaves anything it doesn't recognise untouched
 * (numbers, ₹ amounts, and text that is ALREADY in Devanagari all pass through).
 * A manual Hindi override always wins when provided.
 */

/** word (lowercased, no punctuation) → Hindi */
const HINDI_WORDS: Record<string, string> = {
  // planets / nodes
  sun: "सूर्य", surya: "सूर्य",
  moon: "चंद्र", chandra: "चंद्र", chandrama: "चंद्रमा",
  mars: "मंगल", mangal: "मंगल", mangala: "मंगल",
  mercury: "बुध", budh: "बुध", budha: "बुध",
  jupiter: "गुरु", guru: "गुरु", brihaspati: "बृहस्पति",
  venus: "शुक्र", shukra: "शुक्र",
  saturn: "शनि", shani: "शनि",
  rahu: "राहु",
  ketu: "केतु",
  // ritual / remedy vocabulary
  jap: "जाप", jaap: "जाप", japa: "जाप",
  path: "पाठ", paath: "पाठ", patha: "पाठ",
  dan: "दान", daan: "दान", daana: "दान",
  mantra: "मंत्र", mantras: "मंत्र",
  shanti: "शांति", shaanti: "शांति",
  puja: "पूजा", pooja: "पूजा", pujan: "पूजन",
  havan: "हवन", hawan: "हवन", homa: "होम", hom: "होम",
  abhishek: "अभिषेक", abhishekam: "अभिषेक",
  anushthan: "अनुष्ठान", anushthaan: "अनुष्ठान",
  rudra: "रुद्र", rudraksha: "रुद्राक्ष", rudraksh: "रुद्राक्ष",
  yantra: "यंत्र", yant: "यंत्र",
  graha: "ग्रह", grah: "ग्रह",
  dosh: "दोष", dosha: "दोष",
  yog: "योग", yoga: "योग",
  kaal: "काल", kaalsarp: "कालसर्प", sarp: "सर्प", sarpa: "सर्प",
  vrat: "व्रत", upvas: "उपवास", upay: "उपाय", upaay: "उपाय",
  daan_patra: "दान",
  gayatri: "गायत्री", mahamrityunjay: "महामृत्युंजय", hanuman: "हनुमान",
  chalisa: "चालीसा", sundarkand: "सुंदरकांड", stotra: "स्तोत्र",
  navagraha: "नवग्रह", navgrah: "नवग्रह",
  times: "बार", time: "बार", din: "दिन", days: "दिन", day: "दिन",
  gemstone: "रत्न", gem: "रत्न", ratna: "रत्न", ratan: "रत्न",
  metal: "धातु", finger: "अंगुली",
};

const hasDevanagari = (s: string) => /[ऀ-ॿ]/.test(s);

/** Convert an English phrase to Hindi word-by-word. Unknown ASCII words, numbers
 *  and symbols are kept as-is; already-Hindi text passes through unchanged. */
export function toHindi(text: string, override?: string): string {
  const o = (override ?? "").trim();
  if (o) return o; // manual Hindi override always wins
  const src = (text ?? "").trim();
  if (!src || hasDevanagari(src)) return src;
  return src
    .split(/(\s+)/) // keep the whitespace runs so spacing is preserved
    .map((tok) => {
      if (/^\s+$/.test(tok) || !tok) return tok;
      const m = tok.match(/^([^\w]*)([A-Za-z]+)([^\w]*)$/); // strip leading/trailing punctuation
      if (!m) return tok; // numbers, ₹ amounts, punctuation-only → unchanged
      const [, pre, word, post] = m;
      const hi = HINDI_WORDS[word.toLowerCase()];
      return hi ? `${pre}${hi}${post}` : tok;
    })
    .join("");
}

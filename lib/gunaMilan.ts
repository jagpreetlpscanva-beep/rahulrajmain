/**
 * Ashtakoot / Guna Milan (कुंडली मिलान) — deterministic Vedic compatibility score
 * out of 36, computed purely from each person's Moon rashi (0–11) and Moon
 * nakshatra (0–26). No random / hardcoded results — everything derives from the
 * actual birth charts (computed by lib/vedic.ts computeKundli).
 *
 * Rashi index:      0 = मेष (Aries) … 11 = मीन (Pisces)
 * Nakshatra index:  0 = अश्विनी … 26 = रेवती
 */

export interface MoonPos {
  moonRashi: number; // 0–11
  moonNak: number;   // 0–26
}

export interface KootRow {
  key: string;
  name: string;   // Hindi koot name
  max: number;
  obtained: number;
  area: string;   // Hindi "जीवन क्षेत्र"
}

export interface GunaMilanResult {
  koots: KootRow[];
  total: number;      // out of 36
  maxTotal: 36;
  verdict: string;    // Hindi interpretation
}

/* ---------------- Varna (max 1) — rashi based ---------------- */
// Brahmin=4, Kshatriya=3, Vaishya=2, Shudra=1 (by Moon sign element)
const VARNA_RANK = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // Aries..Pisces
function varnaScore(b: number, g: number): number {
  // groom's varna should be >= bride's
  return VARNA_RANK[b] >= VARNA_RANK[g] ? 1 : 0;
}

/* ---------------- Vashya (max 2) — rashi based ---------------- */
// groups: 0 Chatushpada, 1 Nara(human), 2 Jalachar, 3 Vanachar, 4 Keeta
const VASHYA_GROUP = [0, 0, 1, 2, 3, 1, 1, 4, 1, 0, 1, 2];
const VASHYA_M = [
  [2, 1, 1, 1, 1],
  [1, 2, 0.5, 0, 1],
  [1, 0.5, 2, 0.5, 1],
  [1, 0, 0.5, 2, 1],
  [1, 1, 1, 1, 2],
];
function vashyaScore(b: number, g: number): number {
  return VASHYA_M[VASHYA_GROUP[b]][VASHYA_GROUP[g]];
}

/* ---------------- Tara (max 3) — nakshatra based ---------------- */
function taraScore(bNak: number, gNak: number): number {
  const rem = (from: number, to: number) => {
    const c = ((to - from + 27) % 27) + 1;
    const r = c % 9;
    return r === 0 ? 9 : r;
  };
  const bad = [3, 5, 7];
  const good1 = !bad.includes(rem(bNak, gNak));
  const good2 = !bad.includes(rem(gNak, bNak));
  return (good1 ? 1.5 : 0) + (good2 ? 1.5 : 0);
}

/* ---------------- Yoni (max 4) — nakshatra animal ---------------- */
// animals: 0 Horse,1 Elephant,2 Sheep,3 Serpent,4 Dog,5 Cat,6 Rat,7 Cow,
//          8 Buffalo,9 Tiger,10 Deer,11 Monkey,12 Mongoose,13 Lion
const YONI_ANIMAL = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1];
// arch-enemy pairs → 0 points; same → 4; else neutral 2
const YONI_ENEMY: [number, number][] = [
  [7, 9], [0, 8], [1, 13], [2, 11], [3, 12], [5, 6], [4, 10],
];
function yoniScore(bNak: number, gNak: number): number {
  const a = YONI_ANIMAL[bNak];
  const c = YONI_ANIMAL[gNak];
  if (a === c) return 4;
  if (YONI_ENEMY.some(([x, y]) => (x === a && y === c) || (x === c && y === a))) return 0;
  return 2;
}

/* ---------------- Graha Maitri (max 5) — rashi lord friendship ---------------- */
// planet ids: 0 Sun,1 Moon,2 Mars,3 Mercury,4 Jupiter,5 Venus,6 Saturn
const RASHI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // Aries..Pisces
// 1 = friend, 0 = neutral, -1 = enemy (natural relationships)
const FRIEND: number[][] = [
  //     Su  Mo  Ma  Me  Ju  Ve  Sa
  [1, 1, 1, 0, 1, -1, -1], // Sun
  [1, 1, 0, 1, 0, 0, 0],   // Moon
  [1, 1, 1, -1, 1, 0, 0],  // Mars
  [1, -1, 0, 1, 0, 1, 0],  // Mercury
  [1, 1, 1, -1, 1, -1, 0], // Jupiter
  [-1, -1, 0, 1, 0, 1, 1], // Venus
  [-1, -1, -1, 1, 0, 1, 1],// Saturn
];
function maitriScore(b: number, g: number): number {
  const lb = RASHI_LORD[b], lg = RASHI_LORD[g];
  if (lb === lg) return 5;
  const r1 = FRIEND[lb][lg];
  const r2 = FRIEND[lg][lb];
  const key = [r1, r2].sort().join(",");
  if (key === "1,1") return 5;
  if (key === "0,1") return 4;
  if (key === "0,0") return 3;
  if (key === "-1,1") return 1;
  if (key === "-1,0") return 0.5;
  return 0; // -1,-1
}

/* ---------------- Gana (max 6) — nakshatra ---------------- */
// 0 Deva, 1 Manushya, 2 Rakshasa
const GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
function ganaScore(bNak: number, gNak: number): number {
  const a = GANA[bNak], c = GANA[gNak];
  if (a === c) return 6;
  const set = [a, c].sort().join(",");
  if (set === "0,1") return a === 0 ? 6 : 5; // Deva-Manushya
  if (set === "0,2") return 1;               // Deva-Rakshasa
  return 0;                                  // Manushya-Rakshasa
}

/* ---------------- Bhakoot (max 7) — rashi distance ---------------- */
function bhakootScore(b: number, g: number): number {
  const d1 = ((g - b + 12) % 12) + 1;
  const d2 = ((b - g + 12) % 12) + 1;
  const set = [d1, d2].sort((x, y) => x - y).join(",");
  if (set === "2,12" || set === "6,8" || set === "5,9") return 0;
  return 7;
}

/* ---------------- Nadi (max 8) — nakshatra ---------------- */
// 0 Adi, 1 Madhya, 2 Antya
const NADI = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2];
function nadiScore(bNak: number, gNak: number): number {
  return NADI[bNak] === NADI[gNak] ? 0 : 8;
}

/* ---------------- interpretation (Hindi) ---------------- */
function verdictFor(total: number): string {
  if (total < 18) return "कम अनुकूलता";
  if (total < 24) return "औसत अनुकूलता";
  if (total < 28) return "अच्छी अनुकूलता";
  if (total < 32) return "बहुत अच्छी अनुकूलता";
  return "उत्कृष्ट अनुकूलता";
}

/** Compute the full Ashtakoot (Guna Milan) between boy and girl Moon positions. */
export function computeGunaMilan(boy: MoonPos, girl: MoonPos): GunaMilanResult {
  const b = boy.moonRashi, g = girl.moonRashi;
  const bn = boy.moonNak, gn = girl.moonNak;
  const koots: KootRow[] = [
    { key: "varna", name: "वर्ण", max: 1, obtained: varnaScore(b, g), area: "कार्य / सामाजिक स्थिति" },
    { key: "vashya", name: "वश्य", max: 2, obtained: vashyaScore(b, g), area: "प्रभुत्व / आकर्षण" },
    { key: "tara", name: "तारा", max: 3, obtained: taraScore(bn, gn), area: "भाग्य / स्वास्थ्य" },
    { key: "yoni", name: "योनि", max: 4, obtained: yoniScore(bn, gn), area: "मानसिक एवं शारीरिक अनुकूलता" },
    { key: "maitri", name: "मैत्री", max: 5, obtained: maitriScore(b, g), area: "वैचारिक अनुकूलता" },
    { key: "gana", name: "गण", max: 6, obtained: ganaScore(bn, gn), area: "स्वभाव" },
    { key: "bhakoot", name: "भकूट", max: 7, obtained: bhakootScore(b, g), area: "प्रेम / पारिवारिक जीवन" },
    { key: "nadi", name: "नाड़ी", max: 8, obtained: nadiScore(bn, gn), area: "स्वास्थ्य / संतान" },
  ];
  const total = Math.round(koots.reduce((s, k) => s + k.obtained, 0) * 10) / 10;
  return { koots, total, maxTotal: 36, verdict: verdictFor(total) };
}

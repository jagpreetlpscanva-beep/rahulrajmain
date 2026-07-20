import type { Metadata } from "next";
import { getConsultation } from "@/lib/prescriptions";
import { chartSvgDataUri, type computeKundli } from "@/lib/vedic";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ज्योतिष परामर्श — डॉ० राहुल राज", robots: { index: false, follow: false } };

const fmtDMY = (ymd: string) => {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-");
  return d && m && y ? `${d}/${m}/${y}` : ymd;
};

function Letterhead() {
  return (
    <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#6d1414] via-[#8a2020] to-[#e2662a] px-6 py-3 text-white">
      <div>
        <p className="font-serif text-2xl font-extrabold leading-tight">🕉 डॉ० राहुल राज <span className="text-amber-200">‘ज्योतिष गुरु’</span> 🕉</p>
        <p className="text-sm font-semibold">पी.एच.डी., गोल्ड मेडलिस्ट</p>
        <p className="mt-1 text-xs">ज्योतिष पारिजात · ज्योतिष रत्नश्री · ज्योतिष भास्कर</p>
        <p className="text-xs">शिष्य — पं० के.ए. दूबे पद्मेश</p>
      </div>
      <div className="text-right text-[11px] leading-snug">
        <p className="text-sm font-bold text-amber-200">परामर्श हेतु कॉल करें</p>
        <p className="text-lg font-extrabold">📞 9415312590</p>
        <p className="mt-1 opacity-90"><b>कार्यालय/निवास:</b> डी-10, श्रवण अपार्टमेंट के सामने, सेक्टर-ई, लखनऊ</p>
        <p className="opacity-90"><b>शाखा:</b> ‘ज्योतिष योग’ सी-100, सेक्टर-डी, एल.डी.ए. कालोनी, कानपुर रोड, लखनऊ</p>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <div className="bg-gradient-to-r from-[#e2662a] via-[#8a2020] to-[#6d1414] px-6 py-3 text-center text-white">
      <p className="text-sm font-bold text-amber-200">: सम्पर्क समय : <span className="text-white/90">(केवल अपॉइंटमेंट हेतु)</span></p>
      <p className="text-xs">प्रातः 11:00 से 1:00 · सायं 06:00 से 8:00 · रविवार सायं अवकाश</p>
      <p className="mt-0.5 text-[11px] font-semibold text-amber-200">कृपया टोने-टोटके, वशीकरण इत्यादि के लिए सम्पर्क न करें।</p>
    </div>
  );
}

export default async function RxPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getConsultation(id);

  if (!c) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4eee3] p-6 text-center">
        <p className="text-lg font-semibold text-ink/60">यह परामर्श नहीं मिला (link ग़लत या हटा दिया गया)।</p>
      </div>
    );
  }

  const chart = c.kundali ? chartSvgDataUri(c.kundali as ReturnType<typeof computeKundli>, "D1", "#a01414") : null;

  return (
    <div className="min-h-screen bg-[#f4eee3] py-6 print:bg-white print:py-0">
      {/* on this page only, allow the whole doc to print (override the global print rule) */}
      <style>{`@media print { body > *:not(#print-portal){ display:revert !important } .rx-hide-print{ display:none !important } @page{ size:A4; margin:0 } }`}</style>

      <div className="rx-hide-print mx-auto mb-4 max-w-[210mm] px-3 text-right"><PrintButton /></div>

      <div className="mx-auto flex min-h-[297mm] w-full max-w-[210mm] flex-col bg-white shadow-lg print:shadow-none">
        <Letterhead />
        <div className="flex-1 px-6 py-4 text-sm text-[#222]">
          <div className="grid grid-cols-3 gap-x-4 gap-y-1">
            <p><b>ग्राहक:</b> {c.patientName}</p><p><b>मोबाइल:</b> {c.mobile}</p><p><b>लिंग:</b> {c.gender}</p>
            <p><b>जन्म तिथि:</b> {fmtDMY(c.dob)}</p><p><b>समय:</b> {c.tob}</p><p><b>स्थान:</b> {c.place}</p>
            <p><b>दिनांक:</b> {fmtDMY(c.createdAt.slice(0, 10))}</p><p className="col-span-2"><b>ज्योतिषी:</b> {c.astrologer}</p>
          </div>

          <div className="mt-3 grid grid-cols-[1.1fr,1fr] gap-4">
            <div>
              <p className="font-bold text-[#a01414]">लग्न कुण्डली</p>
              <div className="grid aspect-square w-full max-w-[95mm] place-items-center border-2 border-[#a01414]/70 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {chart ? <img src={chart} alt="कुण्डली" className="h-full w-full object-contain" /> : null}
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p><b>महादशा —</b> {c.mahadasha}</p><p><b>अन्तर्दशा —</b> {c.antardasha}</p><p><b>प्र० दशा —</b> {c.pratyantar}</p><p><b>दोष —</b> {c.dosha}</p><p><b>योग —</b> {c.yog}</p>
            </div>
          </div>

          {c.rows.some((r) => r.planet) && (
            <table className="mt-3 w-full border-collapse text-[12px]">
              <thead><tr className="bg-[#f2e4d6] text-left"><th className="border border-black/15 px-2 py-1">ग्रह</th><th className="border border-black/15 px-2 py-1">उपाय</th><th className="border border-black/15 px-2 py-1">टिप्पणी</th></tr></thead>
              <tbody>{c.rows.filter((r) => r.planet).map((r, i) => (<tr key={i}><td className="border border-black/15 px-2 py-1 align-top">{r.planet}</td><td className="border border-black/15 px-2 py-1 align-top">{r.remedies.map((x, j) => <div key={j}>• {x}</div>)}</td><td className="border border-black/15 px-2 py-1 align-top">{r.notes}</td></tr>))}</tbody>
            </table>
          )}

          {c.gemstones.some((g) => g.stone) && (
            <div className="mt-3 space-y-1">
              {c.gemstones.filter((g) => g.stone).map((g, i) => (
                <div key={i} className="rounded border border-[#a01414]/40 p-2 text-[12px]"><b className="text-[#a01414]">रत्न:</b> {g.planet} → {g.stone} · {g.weight} · {g.metal} · {g.finger} · {g.day} · मंत्र: {g.mantra}</div>
              ))}
            </div>
          )}

          {c.notes && <p className="mt-2 text-[12px]"><b>टिप्पणी:</b> {c.notes}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
}

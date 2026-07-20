"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rx-hide-print rounded-lg bg-[#6d1414] px-5 py-2.5 text-sm font-bold text-white shadow"
    >
      📄 PDF सेव करें
    </button>
  );
}

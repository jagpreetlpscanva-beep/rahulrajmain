"use client";

import { WhatsAppIcon } from "../icons";

const WHATSAPP_HREF = "https://wa.me/919415312590";

/** Floating WhatsApp chat button (fixed bottom-right on every page). */
export function ScrollToTop() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-500 py-3 pl-3 pr-4 text-white shadow-[0_10px_30px_-6px_rgba(16,140,90,0.6)] transition-all hover:-translate-y-1 hover:bg-emerald-600"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
        <WhatsAppIcon className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold">Chat</span>
    </a>
  );
}

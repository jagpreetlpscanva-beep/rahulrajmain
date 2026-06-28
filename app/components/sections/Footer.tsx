import { NAV_MENU } from "@/lib/content";
import { Logo } from "../ui/Logo";
import { CalendarIcon, WhatsAppIcon } from "../icons";

const QUICK_LINKS = [...NAV_MENU.left, ...NAV_MENU.right];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-night-gradient text-cream/80"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="container-px relative py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* brand */}
          <div>
            <Logo variant="light" layout="row" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">
              Personalized Vedic guidance for your relationships, career,
              business, finances and overall well-being. Begin your journey to
              clarity and confidence today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
              >
                <CalendarIcon className="h-4 w-4" />
                Book Consultation
              </a>
              <a
                href="https://wa.me/919415312590"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold-400/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition-colors hover:bg-gold-400/10"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Now
              </a>
            </div>
          </div>

          {/* quick links */}
          <nav aria-label="Footer">
            <h3 className="font-serif text-lg font-semibold text-cream">Quick Links</h3>
            <ul className="mt-5 grid grid-cols-2 gap-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/65 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream">Get In Touch</h3>
            <ul className="mt-5 space-y-3 text-sm text-cream/65">
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400">Email</span>
                <a href="mailto:hello@rahulrajastrologer.com" className="hover:text-gold-300">
                  hello@rahulrajastrologer.com
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400">Phone</span>
                <a href="tel:+919415312590" className="hover:text-gold-300">+91 94153 12590</a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gold-400">Hours</span>
                Mon – Sat, 10:00 AM – 7:00 PM IST
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gold-400/15 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {year} Rahul Raj — Vedic Astrologer. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/admin" className="transition-colors hover:text-gold-300">Admin</a>
            <p>Made with devotion &amp; the wisdom of the stars.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

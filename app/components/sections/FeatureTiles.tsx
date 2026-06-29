import { Icon } from "../icons";
import { IconImage } from "../ui/IconImage";
import type { IconName } from "@/lib/content";

const TILES: { id: string; label: string; sub: string; icon: IconName; href: string }[] = [
  { id: "reports", label: "Explore Reports", sub: "Detailed insights about your life", icon: "birth-chart", href: "/reports" },
  { id: "consult", label: "Consult Now", sub: "One-on-one consultation with Rahul Raj", icon: "users", href: "/consultation" },
  { id: "gemstones", label: "Gemstones & Remedies", sub: "Authentic gemstones for positive change", icon: "wealth", href: "/consultation" },
  { id: "poojas", label: "Powerful Poojas", sub: "Vedic rituals for peace, prosperity & success", icon: "om", href: "/online-pooja" },
  { id: "ask", label: "Ask Astrologer", sub: "Get answers to your most important questions", icon: "lotus-person", href: "/#contact" },
  { id: "learn", label: "Learn Astrology", sub: "Courses to master the science of astrology", icon: "star", href: "/courses" },
];

/** Quick-access tiles in one card peeking up below the hero. */
export function FeatureTiles() {
  return (
    <section className="paper-bg relative z-10 pb-10 lg:pb-14">
      <div className="container-px">
        <div className="mx-auto -mt-14 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold-500/15 bg-gold-500/12 shadow-card lg:-mt-20 lg:grid-cols-6 sm:grid-cols-3">
          {TILES.map((t) => (
            <a
              key={t.label}
              href={t.href}
              className="group flex flex-col items-center gap-2 bg-white p-6 text-center text-gold-600 transition-colors hover:bg-gold-50/60"
            >
              <span className="relative mb-1 grid h-20 w-20 place-items-center">
                {/* soft gold glow behind the logo */}
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,213,138,0.6),transparent_70%)] blur-[6px] transition-transform duration-300 group-hover:scale-110" />
                <IconImage src={`/features/${t.id}.png`} alt={t.label} className="relative h-14 w-14 drop-shadow-[0_4px_10px_rgba(192,138,46,0.45)]">
                  <Icon name={t.icon} className="h-9 w-9" />
                </IconImage>
              </span>
              <span className="font-serif text-base font-bold leading-tight text-ink">{t.label}</span>
              <span className="text-xs leading-snug text-ink/55">{t.sub}</span>
              <span className="mt-1.5 grid h-8 w-8 place-items-center rounded-full border border-gold-500/30 text-sm text-gold-600 transition-colors group-hover:bg-gold-gradient group-hover:text-night">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Icon } from "../icons";
import type { IconName } from "@/lib/content";

const TILES: { label: string; sub: string; icon: IconName; href: string }[] = [
  { label: "Explore Reports", sub: "Detailed insights about your life", icon: "birth-chart", href: "/reports" },
  { label: "Consult Now", sub: "One-on-one consultation with Rahul Raj", icon: "users", href: "/consultation" },
  { label: "Gemstones & Remedies", sub: "Authentic gemstones for positive change", icon: "wealth", href: "/consultation" },
  { label: "Powerful Poojas", sub: "Vedic rituals for peace, prosperity & success", icon: "om", href: "/online-pooja" },
  { label: "Ask Astrologer", sub: "Get answers to your most important questions", icon: "lotus-person", href: "/#contact" },
  { label: "Learn Astrology", sub: "Courses to master the science of astrology", icon: "star", href: "/courses" },
];

/** Quick-access tiles in one card peeking up below the hero. */
export function FeatureTiles() {
  return (
    <section className="paper-bg relative z-10 pb-16 lg:pb-24">
      <div className="container-px">
        <div className="mx-auto -mt-14 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gold-500/15 bg-gold-500/12 shadow-card lg:-mt-20 lg:grid-cols-6 sm:grid-cols-3">
          {TILES.map((t) => (
            <a
              key={t.label}
              href={t.href}
              className="group flex flex-col items-center gap-2.5 bg-white p-6 text-center transition-colors hover:bg-gold-50"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 text-gold-600 transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-50">
                <Icon name={t.icon} className="h-8 w-8" />
              </span>
              <span className="font-serif text-base font-bold leading-tight text-ink">{t.label}</span>
              <span className="text-xs leading-snug text-ink/55">{t.sub}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

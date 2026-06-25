import { Icon } from "../icons";
import type { IconName } from "@/lib/content";

const TILES: { label: string; icon: IconName; href: string }[] = [
  { label: "Explore Reports", icon: "birth-chart", href: "/reports" },
  { label: "Consult Now", icon: "users", href: "/consultation" },
  { label: "Gemstones & Mantra", icon: "wealth", href: "/consultation" },
  { label: "Powerful Poojas", icon: "om", href: "/online-pooja" },
  { label: "Ask Astrologer", icon: "lotus-person", href: "/#contact" },
  { label: "Learn Astrology", icon: "star", href: "/courses" },
];

/** Quick-access tiles that peek up below the hero. */
export function FeatureTiles() {
  return (
    <section className="paper-bg relative z-10 pb-16 lg:pb-24">
      <div className="container-px">
        <div className="mx-auto -mt-12 grid max-w-5xl grid-cols-2 justify-center gap-3.5 sm:grid-cols-3 sm:gap-4 lg:-mt-16 lg:grid-cols-6">
          {TILES.map((t) => (
            <a
              key={t.label}
              href={t.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gold-500/15 bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/40 text-gold-600 transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-50">
                <Icon name={t.icon} className="h-8 w-8" />
              </span>
              <span className="font-serif text-sm font-bold leading-tight text-ink sm:text-base">
                {t.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

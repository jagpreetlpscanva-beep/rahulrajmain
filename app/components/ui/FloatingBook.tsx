import type { BookTone } from "@/lib/content";

// per-slide cover palettes (dark base, darker shade) — gold foil stays constant
const TONES: Record<BookTone, [string, string, string]> = {
  espresso: ["#473322", "#322316", "#241610"],
  violet: ["#5B3E8C", "#412A6A", "#2C1A4A"],
  teal: ["#1E5A56", "#123F3C", "#0B2B29"],
  maroon: ["#7C2E37", "#591F27", "#3C141A"],
};

/**
 * Premium hardcover book at the centre of the zodiac wheel. It bobs gently
 * (CSS `animate-float`) and sits at a slight 3D tilt above a soft, static
 * contact shadow. The cover colour is themeable per carousel slide.
 * Respects prefers-reduced-motion via globals.css.
 */
export function FloatingBook({
  className = "",
  tone = "espresso",
}: {
  className?: string;
  tone?: BookTone;
}) {
  const [c0, c1, c2] = TONES[tone];
  return (
    <div className={`relative ${className}`}>
      {/* realistic ground shadow — stays put while the book floats above it */}
      <div className="absolute inset-x-[12%] -bottom-[5%] h-7 rounded-[50%] bg-espresso/35 blur-xl" />

      {/* 3D tilt layer (kept separate so the float animation can compose) */}
      <div
        className="[transform:perspective(1300px)_rotateY(-20deg)_rotateZ(5deg)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="animate-float">
          <svg
            viewBox="0 0 240 310"
            className="h-full w-full drop-shadow-[0_34px_44px_rgba(45,27,18,0.45)]"
            role="img"
            aria-label="Book of Vedic Wisdom"
          >
            <defs>
              <linearGradient id={`cover-${tone}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={c0} />
                <stop offset="55%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
              </linearGradient>
            <linearGradient id="pages" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FBF6EC" />
              <stop offset="100%" stopColor="#E4D7BF" />
            </linearGradient>
            <linearGradient id="bookGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8D6A8" />
              <stop offset="55%" stopColor="#C8A75D" />
              <stop offset="100%" stopColor="#A07F3C" />
            </linearGradient>
            <linearGradient id="sheen" x1="0" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.24" />
              <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <clipPath id="coverClip">
              <rect x="26" y="30" width="172" height="240" rx="8" />
            </clipPath>
          </defs>

          {/* page block (right edge, gives the book depth) */}
          <path d="M196 44 L214 60 L214 268 L196 252 Z" fill="url(#pages)" />
          <path d="M196 44 L214 60 L214 268 L196 252 Z" fill="#000" opacity="0.06" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1="199"
              y1={70 + i * 21}
              x2="212"
              y2={84 + i * 21}
              stroke="#b8a784"
              strokeWidth="1"
              opacity="0.55"
            />
          ))}

          {/* front cover */}
          <rect x="26" y="30" width="172" height="240" rx="8" fill={`url(#cover-${tone})`} />
          {/* subtle gold / light reflections catching the cover */}
          <g clipPath="url(#coverClip)">
            <polygon points="26,30 98,30 48,270 26,270" fill="url(#sheen)" />
            <polygon points="124,30 152,30 72,270 44,270" fill="#FFF3D6" opacity="0.07" />
          </g>
          <rect x="26" y="30" width="172" height="240" rx="8" fill="none" stroke="url(#bookGold)" strokeWidth="1.5" />
          {/* spine shadow */}
          <rect x="26" y="30" width="12" height="240" rx="4" fill="#000" opacity="0.22" />

          {/* inner foil frame */}
          <rect x="40" y="44" width="144" height="212" rx="4" fill="none" stroke="url(#bookGold)" strokeWidth="0.9" opacity="0.85" />
          {/* corner flourishes */}
          {[
            [48, 52, 1, 1],
            [176, 52, -1, 1],
            [48, 248, 1, -1],
            [176, 248, -1, -1],
          ].map(([cx, cy, sx, sy], i) => (
            <path
              key={i}
              d={`M${cx} ${cy} h${14 * sx} M${cx} ${cy} v${14 * sy}`}
              stroke="url(#bookGold)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}

          {/* central emblem — refined thin foil, no glow */}
          <circle cx="112" cy="126" r="34" fill="none" stroke="url(#bookGold)" strokeWidth="1.1" opacity="0.9" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 360) / 12;
            return (
              <rect
                key={i}
                x="111.4"
                y="90"
                width="1.2"
                height="11"
                rx="0.6"
                fill="url(#bookGold)"
                opacity="0.9"
                transform={`rotate(${a} 112 126)`}
              />
            );
          })}
          <circle cx="112" cy="126" r="12" fill="none" stroke="url(#bookGold)" strokeWidth="1" opacity="0.9" />
          <path d="M112 117 L116 126 L112 135 L108 126 Z" fill="url(#bookGold)" opacity="0.95" />

          {/* title */}
          <text x="112" y="202" textAnchor="middle" fontFamily="var(--font-playfair), Georgia, serif" fontSize="21" fontWeight="700" letterSpacing="2.5" fill="url(#bookGold)">
            VEDIC
          </text>
          <text x="112" y="228" textAnchor="middle" fontFamily="var(--font-playfair), Georgia, serif" fontSize="21" fontWeight="700" letterSpacing="2.5" fill="url(#bookGold)">
            WISDOM
          </text>

          {/* bookmark ribbon */}
          <path d="M150 30 h15 v38 l-7.5 -8.5 -7.5 8.5 Z" fill="url(#bookGold)" />
          <path d="M150 30 h15 v38 l-7.5 -8.5 -7.5 8.5 Z" fill="#000" opacity="0.08" />
          </svg>
        </div>
      </div>
    </div>
  );
}

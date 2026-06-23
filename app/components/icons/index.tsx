import type { SVGProps } from "react";
import type { IconName } from "@/lib/content";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
});

/* ---------------- Stats icons ---------------- */

export const UsersIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12.5c-3 0-6 1.5-6 4.2V20h12v-3.3c0-2.7-3-4.2-6-4.2Zm8.5.2c-.7 0-1.4.1-2 .3 1 1 1.5 2.3 1.5 3.8V20H22v-2.8c0-2.5-2.7-4.5-5.5-4.5Z" />
  </svg>
);

export const MedalIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 2 9.4 6.7 4 7.3l3.9 3.6L6.8 16 12 13.3 17.2 16l-1.1-5.1L20 7.3l-5.4-.6L12 2Z" opacity=".25" />
    <circle cx="12" cy="9" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 6.2 13 8l2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 8.3 11 8l1-1.8Z" />
    <path d="M9 13.2 7 22l5-2.6L17 22l-2-8.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 2.5 14.9 8.4l6.5.95-4.7 4.58 1.11 6.47L12 17.4l-5.81 3 1.11-6.47L2.6 9.35l6.5-.95L12 2.5Z" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" opacity=".18" />
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10 11V9.5a2 2 0 0 1 4 0V11" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ---------------- Service icons ---------------- */

export const CoupleIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3.6c.9-1 2.6-1.2 3.6-.1.9.9.8 2.2 0 3.1L12 10 8.4 6.6c-.8-.9-.9-2.2 0-3.1 1-1.1 2.7-.9 3.6.1Z" />
    <path d="M8 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.4c-3 0-5 1.8-5 4.4V21h7v-5.7c0-2.6-1-4.4-2-4.4Z" opacity=".95" />
    <path d="M16 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.4c2 0 5 1.8 5 4.4V21h-7v-5.7c0-2.6 1-4.4 2-4.4Z" opacity=".7" />
  </svg>
);

export const BriefcaseIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9 6V5a3 3 0 0 1 6 0v1h3.5A1.5 1.5 0 0 1 20 7.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5A1.5 1.5 0 0 1 5.5 6H9Zm2-1v1h2V5a1 1 0 0 0-2 0Z" />
    <path d="M19.4 4.9 20 6.1l1.3.2-.95.9.22 1.3-1.17-.62-1.17.62.22-1.3-.95-.9 1.3-.2.57-1.2Z" />
  </svg>
);

export const WealthIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9 3h6l-1.2 2.3a5.5 5.5 0 0 1 3.7 5.2c0 3.6-2.9 6.5-6.5 6.5h-.3C7.4 17 4.8 14.4 4.8 11.1A5.5 5.5 0 0 1 8.2 5.3L7 3h2Zm1.2 4.6h3.6V8.8h-1.3c.1.2.1.5.1.7h1.2V11h-1.3c-.3.9-1 1.4-2 1.4l1.9 2.2h-1.6l-1.9-2.3v-1h.9c.6 0 1-.2 1.2-.6h-2.1V9.5h2.1c-.2-.4-.6-.7-1.2-.7h-.9V7.6Z" />
    <path d="M17.8 13.6c1.4.3 2.4 1 2.4 1.9 0 1.1-1.6 2-3.6 2 .8-.7 1.3-1.6 1.5-2.6l-.3-1.3Z" opacity=".7" />
  </svg>
);

export const LotusPersonIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="5.6" r="2.6" />
    <path d="M12 8.6c-2.4 0-4.4 2-4.4 4.4 0 .7.2 1.4.5 2L12 13l3.9 2c.3-.6.5-1.3.5-2 0-2.4-2-4.4-4.4-4.4Z" />
    <path d="M5 14.5c-1.6 0-3 .8-3 1.8 0 1.6 4.5 3.2 10 3.2s10-1.6 10-3.2c0-1-1.4-1.8-3-1.8-1 0-2 .4-2.4 1L12 18.8 7.4 15.5c-.5-.6-1.4-1-2.4-1Z" opacity=".8" />
  </svg>
);

/* ---------------- Tool icons ---------------- */

export const BirthChartIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="1.5" />
    <path d="M3 3 21 21M21 3 3 21M12 3v18M3 12h18" />
  </svg>
);

export const CompatibilityIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 20.5 4.2 12.9a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1.3 1.3 1.3-1.3a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.5L12 20.5Z" />
    <path d="M18.5 3.2 19 4.5l1.3.5-1.3.5-.5 1.3-.5-1.3L16.7 5l1.3-.5.5-1.3ZM5 2.4l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4.4-1Z" opacity=".85" fill="currentColor" />
  </svg>
);

export const NumerologyIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

export const MagnetIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 3a2 2 0 0 0-2 2v8a10 10 0 0 0 20 0V5a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v8a3 3 0 0 1-6 0V5a2 2 0 0 0-2-2H4Zm0 2h3v3H4V5Zm13 0h3v3h-3V5Z" />
  </svg>
);

export const OmIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5.2 13.4c-.3-1.3.2-2.7 1.3-3.4 1.2-.8 2.8-.5 3.7.5.5.6.6 1.4.3 2.1-.2.5-.7.8-1.2.6-.4-.1-.6-.5-.5-1 .1-.2 0-.3-.1-.4-.5-.4-1.2-.3-1.6.2-.6.6-.7 1.6-.3 2.4.6 1.2 2 1.7 3.3 1.3 1.5-.5 2.4-2 2.3-3.6 0-.6-.2-1.2-.5-1.7l1.3-.9c.5.8.8 1.7.8 2.6.1 2.5-1.5 4.7-3.9 5.4-2.3.7-4.7-.4-5.7-2.4l.5-1.3Z" />
    <path d="M14.5 7.2c.9-.6 2.2-.4 2.9.5.4.5.4 1.2 0 1.7-.4.5-1.1.6-1.6.2-.2-.2-.3-.4-.2-.7l-1.1-1.7Z" opacity=".85" />
    <circle cx="17.7" cy="5.2" r="1.1" />
    <path d="M14.2 16.6c1.6.5 3.4.2 4.8-.8l.9 1.3c-1.8 1.3-4.1 1.6-6.2 1l.5-1.5Z" opacity=".8" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z" />
    <path d="M17.5 3 18 4.6l1.6.5-1.6.5-.5 1.6-.5-1.6L15 5.1l1.6-.5.5-1.6ZM14 7.5l.3 1 1 .3-1 .3-.3 1-.3-1-1-.3 1-.3.3-1Z" opacity=".85" />
  </svg>
);

/* ---------------- UI icons ---------------- */

export const CalendarIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </svg>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const GlobeIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
  </svg>
);

export const GiftIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
    <rect x="3.5" y="8.5" width="17" height="12" rx="1.5" />
    <path d="M3.5 12.5h17M12 8.5v12" />
    <path d="M12 8.5S10.5 4 8 4a2 2 0 0 0 0 4.5h4Zm0 0S13.5 4 16 4a2 2 0 0 1 0 4.5h-4Z" strokeLinecap="round" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/* ---------------- Icon registry ---------------- */

export const ICONS: Record<IconName, (props: IconProps) => React.JSX.Element> = {
  couple: CoupleIcon,
  briefcase: BriefcaseIcon,
  wealth: WealthIcon,
  "lotus-person": LotusPersonIcon,
  "birth-chart": BirthChartIcon,
  compatibility: CompatibilityIcon,
  numerology: NumerologyIcon,
  magnet: MagnetIcon,
  om: OmIcon,
  moon: MoonIcon,
  users: UsersIcon,
  medal: MedalIcon,
  star: StarIcon,
  shield: ShieldIcon,
};

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  const Cmp = ICONS[name];
  return <Cmp {...props} />;
}

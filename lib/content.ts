/**
 * Centralised site content extracted verbatim from the design.
 * Keeping copy here makes the section components reusable and data-driven.
 */

/**
 * Serve a remote image through Next's image optimizer (smaller WebP, resized,
 * edge-cached) so large uploaded photos load fast. Local/relative paths and
 * already-optimized URLs are returned unchanged.
 */
export function optimizeImage(src: string | undefined, width = 1080): string {
  if (!src) return "";
  if (!src.startsWith("http")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=70`;
}

export type IconName =
  | "couple"
  | "briefcase"
  | "wealth"
  | "lotus-person"
  | "birth-chart"
  | "compatibility"
  | "numerology"
  | "magnet"
  | "om"
  | "moon"
  | "users"
  | "medal"
  | "star"
  | "shield";

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Success Stories", href: "#testimonials" },
  { label: "Free Tools", href: "#tools" },
  { label: "Insights", href: "#services" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact Us", href: "#contact" },
];

/** Sections observed for the active-link highlight in the navbar. */
export const SECTION_IDS = ["home", "services", "tools", "testimonials", "contact"] as const;

/* ---------------- Primary navigation (stretched header with dropdowns) ---------------- */

export interface NavMenuItem {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Left- and right-of-logo menus. Hrefs use `/#id` so they work from any page. */
export const NAV_MENU: { left: NavMenuItem[]; right: NavMenuItem[] } = {
  left: [
    {
      label: "Reports",
      href: "/reports",
      children: [
        { label: "Career & Business Report", href: "/reports" },
        { label: "Marriage & Love Report", href: "/reports" },
        { label: "Health & Wellness Report", href: "/reports" },
        { label: "Wealth & Finance Report", href: "/reports" },
        { label: "Personalized Fortune Report", href: "/reports" },
      ],
    },
    {
      label: "Consultation",
      href: "/consultation",
      children: [
        { label: "Book a Consultation", href: "/consultation" },
        { label: "Career & Business", href: "/consultation" },
        { label: "Marriage & Relationship", href: "/consultation" },
        { label: "Kundli Analysis", href: "/consultation" },
      ],
    },
    {
      label: "Horoscopes",
      href: "/horoscope",
      children: [
        { label: "Daily Horoscope", href: "/horoscope" },
        { label: "Weekly Horoscope", href: "/horoscope" },
        { label: "Monthly Horoscope", href: "/horoscope" },
        { label: "Yearly Horoscope", href: "/horoscope" },
      ],
    },
    {
      label: "Free Calculators",
      href: "/#home",
      children: [
        { label: "Free Birth Chart", href: "/#home" },
        { label: "Compatibility Calculator", href: "/#home" },
        { label: "Numerology Calculator", href: "/#home" },
        { label: "Moon Sign Finder", href: "/#home" },
      ],
    },
  ],
  right: [
    { label: "Online Puja", href: "/online-pooja" },
    { label: "Courses", href: "/courses" },
    {
      label: "About Us",
      href: "/about",
      children: [
        { label: "My Story", href: "/about" },
        { label: "Success Stories", href: "/#testimonials" },
        { label: "Reviews", href: "/#testimonials" },
      ],
    },
    { label: "Contact Us", href: "/contact" },
  ],
};

export const LANGUAGES = ["English", "हिन्दी", "मराठी", "தமிழ்"] as const;

/* ---------------- Reports page ---------------- */

/** Report category tabs shown above the grid ("All" selects everything). */
export const REPORT_CATEGORIES = [
  "All",
  "Life Guidance",
  "Relationships",
  "Career & Finance",
  "Wellness",
  "Kids & Family",
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export interface Report {
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** Drop a cover image in /public/reports and set its path here, e.g. "/reports/career.png". */
  image?: string;
  /** Fallback cover gradient (used until an image is provided). */
  accent: [string, string];
  badge?: string;
  /** Current/sale price, e.g. "₹799". */
  price?: string;
  /** Optional struck-through original price, e.g. "₹1,499". */
  oldPrice?: string;
  /** Which category tab this report belongs to (omit = shows only under "All"). */
  category?: Exclude<ReportCategory, "All">;
}

export const REPORTS: Report[] = [
  {
    title: "Career & Business Report",
    tagline: "Find your right direction",
    description:
      "Discover where your strengths truly shine and the most favorable timing for jobs, promotions, and business moves.",
    highlights: ["Ideal career paths", "Favorable & risky periods", "Business & partnership timing"],
    accent: ["#3B5BA9", "#1E2F66"],
    badge: "Bestseller",
    category: "Career & Finance",
    oldPrice: "₹1,499",
    price: "₹799",
  },
  {
    title: "Marriage & Love Report",
    tagline: "Clarity for matters of the heart",
    description:
      "Understand compatibility, timing of marriage, and how to nurture lasting harmony in your relationships.",
    highlights: ["Marriage timing", "Compatibility analysis", "Remedies for harmony"],
    accent: ["#A23B5B", "#5E1B33"],
    badge: "Popular",
    category: "Relationships",
    oldPrice: "₹1,499",
    price: "₹799",
  },
  {
    title: "Health & Wellness Report",
    tagline: "Protect your energy",
    description:
      "Insights into your constitution, sensitive periods for health, and lifestyle guidance aligned to your chart.",
    highlights: ["Vulnerable periods", "Preventive guidance", "Balancing remedies"],
    accent: ["#1F7A6B", "#0C3B34"],
    category: "Wellness",
    oldPrice: "₹1,299",
    price: "₹699",
  },
  {
    title: "Wealth & Finance Report",
    tagline: "Build lasting prosperity",
    description:
      "Map your wealth potential, auspicious windows for investment, and remedies to remove financial blockages.",
    highlights: ["Wealth potential", "Investment timing", "Money remedies"],
    accent: ["#C08A2E", "#7A5212"],
    badge: "New",
    category: "Career & Finance",
    oldPrice: "₹1,499",
    price: "₹799",
  },
  {
    title: "Personalized Fortune Report",
    tagline: "Your year, decoded",
    description:
      "A complete 12-month forecast across career, love, health and money — your favorable periods, all in one place.",
    highlights: ["12-month forecast", "All life areas", "Custom remedies"],
    accent: ["#6B3FA0", "#36205C"],
    badge: "Best Value",
    category: "Life Guidance",
    oldPrice: "₹2,499",
    price: "₹1,299",
  },
  {
    title: "Education & Child Report",
    tagline: "Guidance for the next generation",
    description:
      "Support your child's growth with insights into aptitude, ideal study streams, and supportive timing.",
    highlights: ["Aptitude & strengths", "Ideal study streams", "Supportive periods"],
    accent: ["#2B6CB0", "#163E66"],
    category: "Kids & Family",
    oldPrice: "₹1,299",
    price: "₹699",
  },
];

export interface Stat {
  icon: IconName;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

export const STATS: Stat[] = [
  { icon: "users", value: 5000, suffix: "+", label: "Consultations" },
  { icon: "medal", value: 20, suffix: "+", label: "Years Experience" },
  { icon: "star", value: 4.9, suffix: "/5", decimals: 1, label: "Client Rating" },
  { icon: "shield", value: 100, suffix: "%", label: "Confidential" },
];

export type BookTone = "violet" | "espresso" | "teal" | "maroon";
// Hero slides now live in the CMS — see HeroSlide / DEFAULT_HERO_SLIDES in lib/cms.ts.

export interface Service {
  icon: IconName;
  badge: string;
  title: string;
  description: string;
}

export const SERVICES: Service[] = [
  {
    icon: "couple",
    badge: "Most Popular",
    title: "Marriage & Relationship Consultation",
    description:
      "Find clarity in your relationships. Get solutions for marriage delays, compatibility, and marital harmony.",
  },
  {
    icon: "briefcase",
    badge: "High Demand",
    title: "Career & Business Guidance",
    description:
      "Unlock your career potential and business growth. Make the right decisions with confidence.",
  },
  {
    icon: "wealth",
    badge: "Wealth Solutions",
    title: "Finance & Wealth Consultation",
    description:
      "Improve financial stability and growth. Get guidance for investment, savings, and wealth creation.",
  },
  {
    icon: "lotus-person",
    badge: "Personal Growth",
    title: "Life Purpose & Spiritual Guidance",
    description:
      "Discover your life purpose and inner peace. Spiritual solutions for a balanced and fulfilling life.",
  },
];

export interface Tool {
  icon: IconName;
  title: string;
  description: string;
}

export const TOOLS: Tool[] = [
  {
    icon: "birth-chart",
    title: "Free Birth Chart",
    description: "Generate your detailed Kundli / Janam Kundli in just a few clicks.",
  },
  {
    icon: "compatibility",
    title: "Compatibility Calculator",
    description: "Check compatibility between you and your partner based on Vedic Astrology.",
  },
  {
    icon: "numerology",
    title: "Numerology Calculator",
    description: "Discover your Life Path Number, Destiny Number and more.",
  },
  {
    icon: "magnet",
    title: "Lucky Number Finder",
    description: "Find your lucky numbers to attract success, wealth and happiness.",
  },
  {
    icon: "om",
    title: "Name Analysis",
    description: "Analyze your name and its impact on your life, career and relationships.",
  },
  {
    icon: "moon",
    title: "Moon Sign Finder",
    description: "Find your Moon sign and discover your emotions, nature and inner self.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  initials: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Rahul sir gave me the clarity I was looking for in my career. Highly grateful!",
    name: "Priya S.",
    location: "Mumbai",
    initials: "PS",
    rating: 5,
  },
  {
    quote: "His guidance helped me improve my business and take the right decisions.",
    name: "Rajat K.",
    location: "Delhi",
    initials: "RK",
    rating: 5,
  },
  {
    quote: "We got the solutions to our marriage problems. Thank you Rahul sir!",
    name: "Neha & Amit",
    location: "Bengaluru",
    initials: "NA",
    rating: 5,
  },
  {
    quote: "Very accurate predictions and practical remedies. Truly life-changing!",
    name: "Anjali M.",
    location: "Pune",
    initials: "AM",
    rating: 5,
  },
];

// Each glyph is followed by U+FE0E (text variation selector) to force the
// browser to render the astrological symbol as text rather than a colour emoji.
const TEXT = "︎";
export const ZODIAC_SIGNS = [
  { name: "Aries", glyph: "♈" + TEXT },
  { name: "Taurus", glyph: "♉" + TEXT },
  { name: "Gemini", glyph: "♊" + TEXT },
  { name: "Cancer", glyph: "♋" + TEXT },
  { name: "Leo", glyph: "♌" + TEXT },
  { name: "Virgo", glyph: "♍" + TEXT },
  { name: "Libra", glyph: "♎" + TEXT },
  { name: "Scorpio", glyph: "♏" + TEXT },
  { name: "Sagittarius", glyph: "♐" + TEXT },
  { name: "Capricorn", glyph: "♑" + TEXT },
  { name: "Aquarius", glyph: "♒" + TEXT },
  { name: "Pisces", glyph: "♓" + TEXT },
] as const;

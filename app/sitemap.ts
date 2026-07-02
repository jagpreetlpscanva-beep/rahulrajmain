import type { MetadataRoute } from "next";

const BASE = "https://astrorahulraj.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/best-astrologer-in-lucknow",
    "/reports",
    "/kundli-report",
    "/consultation",
    "/horoscope",
    "/free-calculators",
    "/online-pooja",
    "/courses",
    "/blog",
    "/about",
    "/contact",
  ];
  const now = new Date();
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/best-astrologer-in-lucknow" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/best-astrologer-in-lucknow" ? 0.9 : 0.7,
  }));
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: "https://astrorahulraj.in/sitemap.xml",
    host: "https://astrorahulraj.in",
  };
}

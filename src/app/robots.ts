import { siteConfig } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/signin", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

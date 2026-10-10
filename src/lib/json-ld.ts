import { siteConfig } from "@/lib/site";
import type { Person, ProfilePage, WebSite, WithContext } from "schema-dts";

/**
 * schema.org structured data (JSON-LD). Tells search engines this site is
 * about one person and links them to their profiles in `siteConfig.profiles`.
 * Only mark up what is visible on the page - Google's structured data policy.
 * Validate at https://validator.schema.org and https://search.google.com/test/rich-results
 */

// Same `@id` on every page, so search engines treat it as one person.
const person: Person = {
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.author,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  sameAs: Object.values(siteConfig.profiles),
};

/** Google reads `WebSite` (the site name shown in results) only on the home page. */
export const homeJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: person,
};

/** One profile page per person - the About page. */
export const aboutJsonLd: WithContext<ProfilePage> = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: person,
};

/**
 * Single source of truth for the site's public identity.
 *
 * Forking this project? Change the values below - they are the only place
 * personal details live outside the database. `url` is read from the
 * environment because it has to differ per deployment.
 */

const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  url,
  domain: new URL(url).host,
  name: "Anish Paudel Portfolio",
  author: "Anish Paudel",
  role: "Software Engineer",
  title: "Anish Paudel | Software Engineer",
  titleTemplate: "%s | Anish Paudel",
  description:
    "Anish Paudel is a Software Engineer focused on building reliable, scalable software systems, from backend platforms and distributed services to modern web applications using Node.js, Fastify, PostgreSQL, React, and Next.js.",
  shortDescription:
    "Portfolio of Anish Paudel — Software Engineer building scalable backend systems, full-stack applications, and production-ready software with modern technologies.",
  tagline:
    "Software engineer focused on scalable systems, thoughtful architecture, and impactful products.",
  /** Shown on the generated social preview image. Keep to three short phrases. */
  highlights: [
    "Scalable backend architecture",
    "Event-driven systems",
    "Cloud-ready backend systems",
  ],
  keywords: [
    "Anish Paudel",
    "Software Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "Node.js Developer",
    "NestJS Developer",
    "Fastify",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Java Developer",
    "Python Developer",
    "PostgreSQL",
    "MongoDB",
    "Docker",
  ],
} as const;

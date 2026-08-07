# 📌 Portfolio CMS

A **dynamic portfolio website** powered by a self-built mini CMS.  
Instead of manually editing code and running `git commit && git push` every time I want to update my portfolio, this project lets me log in as an admin, change data (skills, projects, resume, contact info), and see it instantly reflected on the public-facing site. 🚀

---

## ✨ Features

- 🔑 **Authentication with Better Auth** – secure admin dashboard
- 🖥️ **Two Sections**
  - **Client-facing portfolio** → About Me, Projects, Skills, Contact Info, Resume
  - **Admin dashboard** → Manage all portfolio content dynamically
- 📄 **Resume Upload** – upload and replace resume files from dashboard
  - Access via `/resume` or `/sde`
- 🛢️ **Database + Storage** powered by **Supabase**
  - PostgreSQL for structured data
  - Supabase Storage Buckets for resumes & thumbnails
- ⚡ **Prisma ORM** for type-safe DB access
- 🎨 **UI & Styling**
  - Tailwind CSS + shadcn/ui
  - Animations with [react-bits](https://reactbits.dev/) & [aceternity](https://ui.aceternity.com/)

- 🔄 **Instant Updates** – client site reflects changes without redeploying
- **📌 Draggable Timeline / Experience** – Timeline/experience section supports drag-and-drop sorting for easy reordering from the dashboard.
- 🔍 **SEO built in**
  - Per-page titles, descriptions and canonical URLs
  - Auto-generated `robots.txt` and `sitemap.xml`
  - Open Graph / Twitter card tags with a generated preview image
  - Dashboard routes excluded from crawlers

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
- **Backend:** Next.js (server components & server actions)
- **Auth:** Better Auth
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Storage:** Supabase Buckets
- **Animations:** react-bits, aceternity
- **Other Tools:** TypeScript

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/rpaudel379/portfolio-cms.git
cd portfolio-cms
```

### 2️⃣ Install dependencies

```
npm install
# or
bun install
```

### 3️⃣ Environment variables

Create a `.env` file in the root and add:

```
cp .env.sample .env

# or

NODE_ENV="<development | production>"

DATABASE_URL="<url>/postgres?pgbouncer=true"
DIRECT_URL="<url>/postgres"

NEXT_PUBLIC_SUPABASE_URL="<your supabase base url>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<get from supabase dashboard>"

BETTER_AUTH_SECRET="your secret key"
BETTER_AUTH_URL="Base URL of your frontend"

NEXT_PUBLIC_SITE_URL="https://www.example.com"
```


### 4️⃣ Make it yours

Everything else about the site's public identity lives in one file —
[`src/lib/site.ts`](src/lib/site.ts). Edit `siteConfig` to replace the name,
role, description and keywords with your own:

```ts
export const siteConfig = {
  name: "Your Name Portfolio",
  author: "Your Name",
  role: "Software Engineer",
  title: "Your Name | Software Engineer",
  titleTemplate: "%s | Your Name",
  // ...
} as const;
```

The generated social preview image at `src/app/opengraph-image.tsx` reads from
the same config, so it updates automatically.

### 5️⃣ Run database migrations:

```
npx prisma migrate dev
# or
bunx prisma migrate dev
```

### 6️⃣ Run locally

```
npm run dev
# or
bun run dev
```

### 7️⃣ Build for production

```
npm run build
npm run start

# or
bun run build
bun run start
```

## 📂 Project Structure

```bash
.
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets (images, icons, etc.)
├── scripts/              # Utility and prestart scripts
├── src/                  # Application source code
│   ├── app/              # Next.js App Router
│   │   ├── (dashboard)/  # Admin dashboard (authenticated CMS)
│   │   ├── (portfolio)/  # Public portfolio pages (incl. /signin)
│   │   ├── api/          # Route handlers (Better Auth)
│   │   ├── favicon.ico   # App favicon
│   │   ├── global-error.tsx     # Global error boundary
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout + site-wide metadata
│   │   ├── opengraph-image.tsx  # Generated social preview image
│   │   ├── robots.ts     # Generates /robots.txt
│   │   └── sitemap.ts    # Generates /sitemap.xml
│   │
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Core libraries & configs (incl. site.ts)
│   ├── modules/          # Feature-specific modules
│   ├── schema/           # Zod/validation schemas
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── proxy.ts          # Auth gate for /dashboard + /resume, /sde rewrites
│
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🔗 Live Demo

[🌐 View Live Site](https://www.anishpaudel.com)

## 🔮 Future Improvements

- 🔧 **Code Refactoring & Consistency**  
  Improve code quality by refactoring existing modules and enforcing consistent patterns, naming conventions, and folder structures.

- ⚡ **Performance Optimization**  
  Implement React caching, server-side caching, or edge functions to significantly improve load times and responsiveness in production.

- 🗄️ **Database Optimization**  
  Introduce indexing, optimized queries, and caching layers

## 🤝 Contributing

Want to improve this project? PRs are welcome!
Fork it, create a new branch, and submit a pull request 🚀

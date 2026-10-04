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
  - Access via `/resume`
- 🔗 **Uplink (optional)** – manage public files from `/dashboard/uplink`
  - Uploads go directly from the browser to Cloudflare R2 using short-lived upload URLs
  - Each file gets a stable portfolio link at `/uplink/[name]` and a public R2 link
  - Uplink objects use the `uplink/` prefix in the bucket and retain their file extension
  - Deletion removes the R2 object before its database record; a storage error leaves the record intact
- 🛢️ **Database + Storage** powered by **Supabase**
  - PostgreSQL for structured data
  - Supabase Storage Buckets for resumes & thumbnails
  - Cloudflare R2 for Uplink files (optional; Uplink can remain unconfigured)
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
- **Storage:** Supabase Buckets; optional Cloudflare R2 for Uplink
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

# Optional: configure all five values to enable Uplink, or leave all blank.
# R2 credentials are server-only; do not prefix them with NEXT_PUBLIC_.
R2_ACCOUNT_ID="<your-cloudflare-account-id>"
R2_ACCESS_KEY_ID="<your-r2-access-key-id>"
R2_SECRET_ACCESS_KEY="<your-r2-secret-access-key>"
R2_BUCKET_NAME="<your-r2-bucket-name>"
UPLINK_PUBLIC_BASE_URL="https://storage.example.com"
```

### Get the Supabase values

Open the project in the Supabase dashboard and select **Connect** to view the project URL, API key, and Postgres connection strings. The URL is also under **Integrations → Data API**, and API keys are under **Project Settings → API Keys**. See Supabase's guides for [API keys](https://supabase.com/docs/guides/getting-started/api-keys) and [Postgres connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres).

- `NEXT_PUBLIC_SUPABASE_URL`: copy the project's URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: preferably use the project's **Publishable key** (starts with `sb_publishable_`). The app's existing variable name says `ANON_KEY`, but it accepts the publishable key. If your project only has the legacy `anon` key, that works too. Do not put a secret or `service_role` key here; `NEXT_PUBLIC_` values are exposed to browser code.
- `DATABASE_URL`: copy the pooled connection string. For serverless deployments, select the **Transaction pooler** string. Keep the `pgbouncer=true` parameter shown in the sample; if the copied URL already has a query string, append it with `&` instead of `?`.
- `DIRECT_URL`: copy the **Direct connection** string for Prisma migrations. If your network cannot use the direct endpoint, use the **Session pooler** string instead.

Replace the password placeholder in both Postgres URLs with your database password.

### Optional: Configure Cloudflare R2 for Uplink

1. Create an R2 bucket and an API token with object read, write, and delete permission scoped to that bucket.
2. Expose the bucket publicly using either a custom domain or Cloudflare's [Public Development URL](https://developers.cloudflare.com/r2/buckets/public-buckets/), which you enable in the bucket's Settings. Set `UPLINK_PUBLIC_BASE_URL` to the chosen public bucket URL. Use a custom domain for production; the development URL is intended for non-production use.
3. Configure the bucket's CORS policy to allow `PUT` requests from the portfolio origin (`NEXT_PUBLIC_SITE_URL`) with the `Content-Type` header. This allows the browser to upload directly to R2. See Cloudflare's [CORS documentation](https://developers.cloudflare.com/r2/buckets/cors/) for the dashboard steps.
4. Set all five R2 variables above. Leave them all unset to keep the optional Uplink feature disabled; a partial configuration is treated as an error.

In the Cloudflare dashboard, open **R2 Object Storage → your bucket → Settings → CORS Policy → Add CORS policy → JSON** and paste a policy like this. Replace the production origin with the exact origin in `NEXT_PUBLIC_SITE_URL`; keep `localhost` if you upload during local development.

```json
[
  {
    "AllowedOrigins": [
      "https://www.example.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

Uploads are stored under `uplink/` in the configured bucket. For example, a file with object key `uplink/example.pdf` is available at `https://storage.example.com/uplink/example.pdf`. The portfolio link `/uplink/example` looks up the ready asset in the database and redirects to its public storage URL.

The dashboard supports pending and ready upload records, link copying, and deletion. If R2 rejects a deletion, the database record is preserved. R2 and the database do not share a transaction, so a database error after R2 deletion can leave a stale record. Uploads currently use a single PUT request and are limited to just under 5 GB.


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

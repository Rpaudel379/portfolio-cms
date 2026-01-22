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
cp .env.example .env

# or

NODE_ENV="<development | production>"

DATABASE_URL="<url>/postgres?pgbouncer=true"
DIRECT_URL="<url>/postgres"

NEXT_PUBLIC_SUPABASE_URL="<your supabase base url>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<get from supabase dashboard>"

BETTER_AUTH_SECRET="your secret key"
BETTER_AUTH_URL="Base URL of your frontend"
```

### 4️⃣ Run database migrations:

```
npx prisma migrate dev
# or
bunx prisma migrate dev
```

### 5️⃣ Run locally

```
npm run dev
# or
bun run dev
```

### 6️⃣ Build for production

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
│   │   ├── (portfolio)/  # Public portfolio pages
│   │   ├── favicon.ico   # App favicon
│   │   ├── global-error.tsx  # Global error boundary
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── signin/       # Sign-in page
│   │
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Core libraries & configs
│   ├── modules/          # Feature-specific modules
│   ├── schema/           # Zod/validation schemas
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
│
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🔗 Live Demo

[🌐 View Live Demo](https://anishsite.netlify.app)

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

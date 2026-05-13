# StudyFlow 📚

**Plan your study week and never miss a deadline.**

StudyFlow is a free, mobile-first student productivity app that helps you track assignments, organize subjects, take notes, and create simple study plans.

![StudyFlow](https://img.shields.io/badge/Built_with-Next.js-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase&logoColor=white)

## Features

- 📋 **Assignment Tracker** — Track tasks with priorities, due dates, and completion status
- ⏱️ **Exam Countdown** — Countdown timers for upcoming exams
- 📅 **Study Planner** — Auto-distribute topics across study days (no AI needed)
- 📝 **Subject Notes** — Markdown-supported notes organized by subject
- 🔗 **Shareable Plans** — Make study plans public with shareable links
- 📁 **Subject Management** — Color-coded subjects for organization
- 🌙 **Dark/Light Mode** — System-aware theme switching
- 📱 **Mobile-First** — Responsive design that works on all devices

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Database & Auth:** Supabase (free tier)
- **Deployment:** Vercel (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free, for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/studyflow.git
cd studyflow
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the contents of `supabase/migration.sql`
3. Go to **Authentication > Settings** and enable Email/Password sign-ups
4. Go to **Settings > API** to get your project URL and anon key

### 3. Configure Environment Variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add the same environment variables in Vercel's project settings
4. Deploy!

## Free Plan Limits

| Feature | Free | Pro (Coming Soon) |
|---------|------|--------------------|
| Subjects | 3 | Unlimited |
| Active Tasks | 20 | Unlimited |
| Study Plans | 5 | Unlimited |
| Notes | Unlimited | Unlimited |
| Themes | Default | Premium |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── pricing/page.tsx      # Pricing page
│   ├── plan/[slug]/          # Public shared plans
│   ├── auth/callback/        # Auth callback
│   └── dashboard/
│       ├── page.tsx          # Dashboard home
│       ├── subjects/         # Subject management
│       ├── tasks/            # Task management
│       ├── notes/            # Notes
│       ├── planner/          # Study planner
│       └── pricing/          # Pricing (in-app)
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── landing/              # Landing page components
│   ├── dashboard/            # Dashboard components
│   └── providers/            # Context providers
├── lib/
│   ├── supabase/             # Supabase clients
│   ├── types/                # TypeScript types
│   └── utils.ts              # Utility functions
└── middleware.ts              # Auth middleware
```

## License

MIT

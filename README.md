# GymOS (Gym ERP)

Gym Management System built with Next.js, Supabase, and Shadcn.

## Deployment

### 1. Push to GitHub
Ensure all local changes are committed and pushed to your GitHub repository.

### 2. Import to Vercel
- Go to [Vercel Dashboard](https://vercel.com/dashboard).
- Click "Add New" -> "Project" and import your repository.

### 3. Environment Variables
In Vercel Project Settings, add these variables from your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (Your Vercel deployment link)

### 4. Database Setup
Apply [`supabase/schema.sql`](file:///f:/gym-erp/supabase/schema.sql) in your Supabase SQL Editor if you haven't already.

## Local Development

```bash
npm install
npm run dev
```

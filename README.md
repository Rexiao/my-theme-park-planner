# Disney Trip Planner

A Next.js web application that helps users create and manage personalized Disney park itineraries using AI-powered recommendations.

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `INVITE_CODE`
- `SUPABASE_SERVICE_ROLE_SECRET`
- `ADMIN_EMAIL` (this needs to be improved since it's not secure)

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deployment

### Deploy on Vercel

(Notice: This is still in development since Vercel free tier has a very short timeout)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Deploy on GCP

```bash
gcloud builds submit --tag gcr.io/your-project-id/theme-park --project your-project-id
```

Notice that the environment variables are updated from the `.env.gcp` file.
```bash
gcloud run deploy --image gcr.io/your-project-id/theme-park --project your-project-id --platform managed --update-env-vars "$(grep -vE '^\s*(#|$)' .env.gcp | awk -F= '{printf "%s=%s,", $1, $2}' | sed 's/,$//')"
```
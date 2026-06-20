# BrainRoute Auth Setup

BrainRoute uses Supabase Auth as the single identity system. The Next.js database app uses only public Supabase browser credentials. The Streamlit prediction app uses a Supabase service role key only on the Streamlit server to redeem short-lived handoff codes and write account-linked prediction history.

## Google Cloud OAuth

1. Create or use a dedicated Google Cloud project named `BrainRoute Auth`.
2. Configure the OAuth consent screen.
3. Set user type to `External`.
4. Set app name to `BrainRoute`.
5. Set the support email to the maintainer email.
6. Request only these scopes: `openid`, `email`, `profile`.
7. Create an OAuth Client ID.
8. Set application type to `Web application`.
9. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://omicscodeathon.github.io`
10. Add the authorized redirect URI from Supabase Auth Google provider, usually:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

## Supabase Auth

1. In Supabase, open Authentication -> Providers -> Google.
2. Enable Google and paste the Google client ID and client secret.
3. Open Authentication -> Providers -> Email.
4. Enable email magic link or OTP login.
5. Open Authentication -> URL Configuration.
6. Set the Site URL for the environment you are using:
   - Local: `http://localhost:3000`
   - Production: `https://omicscodeathon.github.io/brainroutedb`
7. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://omicscodeathon.github.io/brainroutedb/auth/callback`
8. Run `supabase/auth_user_activity_schema.sql` in the Supabase SQL Editor.

## Next.js Environment Variables

Set these in `brainroute-app/.env.local` for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_STREAMLIT_APP_URL=https://brainroute.streamlit.app/
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For GitHub Pages production, set:

```env
NEXT_PUBLIC_SITE_URL=https://omicscodeathon.github.io/brainroutedb
```

Never put service role keys in Next.js, GitHub Pages, browser code, or checked-in files.

## Streamlit Secrets

Configure these only in Streamlit server secrets:

```toml
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_ANON_KEY = "your-anon-key"
SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"
SUPABASE_MOLECULES_TABLE = "molecules"
SUPABASE_AUTH_HANDOFFS_TABLE = "auth_handoffs"
SUPABASE_PREDICTION_LOGS_TABLE = "user_prediction_runs"
SUPABASE_PREDICTION_BATCHES_TABLE = "prediction_batches"
BRAINROUTE_DB_URL = "https://omicscodeathon.github.io/brainroutedb"
```

The service role key belongs only in Streamlit server secrets. Never expose it in frontend code, browser environment variables, GitHub Pages, or checked-in files.

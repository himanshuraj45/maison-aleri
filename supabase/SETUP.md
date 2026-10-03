# Maison Aleri — Supabase setup

## 1. Local environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://opvuvfpypmqqgxpoozhr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Do not commit `.env.local`.

## 2. Database

In Supabase Dashboard:
**SQL Editor → New query**

Paste the contents of `supabase/schema.sql` and click **Run**.

This creates the customer profile table, row-level security policies, and the new-user profile trigger.

## 3. Phone OTP

In Supabase:
**Authentication → Providers → Phone**

Enable Phone and configure your SMS provider.

The Maison Aleri login page uses Supabase phone OTP and does not invent or display a fake OTP.

## 4. Google / Apple

In Supabase:
**Authentication → Providers**

Enable Google and/or Apple and enter the OAuth credentials from those providers.

Set the callback URL shown by Supabase in each provider's configuration.

## 5. WhatsApp

The UI includes WhatsApp as an OTP choice. Live WhatsApp OTP requires a WhatsApp-capable provider such as Twilio Verify configured with server-side credentials. Never put provider secrets in `.env.local` committed to GitHub.

## 6. Production

Add the same public Supabase URL and publishable key as Vercel environment variables, then redeploy.

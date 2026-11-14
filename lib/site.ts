/** Central site settings. Public values only; nothing here is a secret. */

export const SITE_NAME = "TECHGENSHUB";
export const SITE_TAGLINE = "Create More. Grow Faster.";

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Preference order: NEXT_PUBLIC_SITE_URL, then Vercel's production host, then localhost. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/+$/, "");

/** Set NEXT_PUBLIC_CONTACT_EMAIL in Vercel to a real mailbox you check. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export const POLICY_UPDATED = "15 November 2026";

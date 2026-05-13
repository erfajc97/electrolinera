/**
 * Single source of truth for public contact info.
 *
 * Used by:
 *  - Server endpoint (`src/pages/api/contact.ts`) → Resend `from` / `to`
 *  - UI (`Footer`, `CTA`, legal pages) → `mailto:` and display labels
 *  - SEO (`BaseLayout` → schema.org `Organization.contactPoint`)
 *
 * The mailbox lives in Google Workspace; the domain is verified in Resend,
 * so the same address can both receive (Gmail) and be used as a verified
 * `from` for transactional email.
 */
export const CONTACT = {
  email: "comercial@disartenergy.com",
  fromName: "Disart Energy",
  city: "Bogotá",
  country: "Colombia",
} as const;

/** `From:` header for transactional email — RFC 5322 friendly. */
export const CONTACT_FROM = `${CONTACT.fromName} <${CONTACT.email}>`;

/** `mailto:` href — use everywhere instead of hardcoding the protocol. */
export const CONTACT_MAILTO = `mailto:${CONTACT.email}`;

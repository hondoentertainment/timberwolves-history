import "server-only";

import { headers } from "next/headers";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "hondo4185@gmail.com").toLowerCase();

// These headers must be populated by a trusted auth layer or proxy that strips client-supplied values.
const DEFAULT_ADMIN_EMAIL_HEADER_NAMES = [
  "x-auth-request-email",
  "x-forwarded-email",
  "x-user-email",
  "x-ms-client-principal-name",
  "x-goog-authenticated-user-email",
] as const;

function getAdminEmailHeaderNames(): string[] {
  const configuredHeader = process.env.ADMIN_EMAIL_HEADER?.trim().toLowerCase();
  return configuredHeader
    ? [configuredHeader, ...DEFAULT_ADMIN_EMAIL_HEADER_NAMES]
    : [...DEFAULT_ADMIN_EMAIL_HEADER_NAMES];
}

function normalizeEmail(value: string | null): string | null {
  const raw = value?.split(",")[0]?.trim();
  if (!raw) return null;

  const email = raw.includes(":") ? raw.split(":").at(-1)?.trim() : raw;
  return email ? email.toLowerCase() : null;
}

export async function getRequestUserEmail(): Promise<string | null> {
  const requestHeaders = await headers();

  for (const headerName of getAdminEmailHeaderNames()) {
    const email = normalizeEmail(requestHeaders.get(headerName));
    if (email) return email;
  }

  return null;
}

export async function isAdminRequest(): Promise<boolean> {
  return (await getRequestUserEmail()) === ADMIN_EMAIL;
}

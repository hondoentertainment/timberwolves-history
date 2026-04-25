const SUBJECT = "Wolves History correction";

const BODY_TEMPLATE = `Page URL (paste from browser):
 

What should change (facts only; cite a source if possible):
 

`;

/**
 * Mailto for reader corrections. Set `NEXT_PUBLIC_CORRECTIONS_EMAIL` in production
 * so the “To” field is prefilled; without it, many clients still open compose with
 * subject/body only (user chooses recipient).
 */
export function getCorrectionMailto(): string {
  const to = (process.env.NEXT_PUBLIC_CORRECTIONS_EMAIL ?? "").trim();
  const q = new URLSearchParams();
  q.set("subject", SUBJECT);
  q.set("body", BODY_TEMPLATE);
  const query = q.toString();
  return to ? `mailto:${to}?${query}` : `mailto:?${query}`;
}

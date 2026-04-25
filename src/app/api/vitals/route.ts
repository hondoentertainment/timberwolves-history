import { processWebVital } from "@/lib/performance/process-web-vital";

const MAX_BODY = 16_384;

/**
 * Optional ingest for Web Vitals. Enable with `NEXT_PUBLIC_PERF_ENDPOINT=/api/vitals`
 * from the client monitor. Logs degraded metrics on the server for production triage.
 */
export async function POST(req: Request) {
  if (req.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return Response.json({ error: "Expected application/json" }, { status: 415 });
  }

  const text = await req.text();
  if (text.length > MAX_BODY) {
    return Response.json({ error: "Body too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const m = body as Record<string, unknown>;
  const name = m.name;
  const value = m.value;
  if (typeof name !== "string" || typeof value !== "number" || !Number.isFinite(value)) {
    return Response.json({ error: "name (string) and value (number) required" }, { status: 400 });
  }

  const processed = processWebVital({
    name,
    value,
    rating: typeof m.rating === "string" ? m.rating : undefined,
    id: typeof m.id === "string" ? m.id : undefined,
    navigationType: typeof m.navigationType === "string" ? m.navigationType : undefined,
  });

  if (!processed) {
    return Response.json({ ok: true, ignored: true });
  }

  if (processed.shouldRecommend) {
    console.warn(
      "[perf][vitals]",
      processed.name,
      processed.rating,
      Math.round(processed.value * 1000) / 1000,
      processed.recommendations.join(" | "),
    );
  }

  return Response.json({ ok: true, rating: processed.rating });
}

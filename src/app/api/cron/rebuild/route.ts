import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function bearerMatches(header: string | null, secret: string): boolean {
  if (!header || !header.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(secret, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Secured cache rebuild for Vercel Cron. Set `CRON_SECRET` in project env and send
 * `Authorization: Bearer <CRON_SECRET>` (Vercel does this automatically when configured).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !bearerMatches(req.headers.get("authorization"), secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    revalidateTag("wolves-players", "max");
    revalidateTag("nba-team-years", "max");
    revalidateTag("nba-roster", "max");
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    revalidated: ["wolves-players", "nba-team-years", "nba-roster"],
  });
}

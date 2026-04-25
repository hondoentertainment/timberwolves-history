import changelog from "@/data/changelog.json";
import { getAllLongreads } from "@/lib/longreads";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(isoDate: string): string {
  const d = new Date(`${isoDate}T17:00:00Z`);
  return d.toUTCString();
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  type Item = { title: string; link: string; guid: string; pub: string; desc: string };
  const items: Item[] = [];

  for (const e of changelog.entries) {
    const guid = `${base}/changelog#${encodeURIComponent(`${e.date}-${e.title}`)}`;
    const desc = e.items.map((i) => `• ${escapeXml(i)}`).join("\n");
    items.push({
      title: e.title,
      link: `${base}/changelog`,
      guid,
      pub: pubDate(e.date),
      desc,
    });
  }

  for (const s of getAllLongreads()) {
    const link = `${base}/stories/${encodeURIComponent(s.slug)}`;
    items.push({
      title: s.title,
      link,
      guid: link,
      pub: pubDate(s.published),
      desc: escapeXml(s.dek),
    });
  }

  items.sort((a, b) => Date.parse(b.pub) - Date.parse(a.pub));

  const channelTitle = escapeXml("Wolves History updates");
  const channelDesc = escapeXml("Changelog and new editorial stories from Wolves History.");
  const itemXml = items
    .map(
      (it) => `
  <item>
    <title>${escapeXml(it.title)}</title>
    <link>${it.link}</link>
    <guid isPermaLink="true">${it.guid}</guid>
    <pubDate>${it.pub}</pubDate>
    <description>${it.desc}</description>
  </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${channelTitle}</title>
    <link>${base}</link>
    <description>${channelDesc}</description>
    <language>en-us</language>${itemXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

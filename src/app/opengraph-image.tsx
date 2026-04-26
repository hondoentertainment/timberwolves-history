import { ImageResponse } from "next/og";

export const alt = "Wolves History — Minnesota Timberwolves archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050506 0%, #0a1a16 40%, #062a27 100%)",
          padding: 72,
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 700, color: "#f4f4f5" }}>Wolves History</div>
        <div style={{ marginTop: 14, fontSize: 30, fontWeight: 600, color: "#6ee7b7" }}>
          Minnesota Timberwolves archive
        </div>
        <div style={{ marginTop: 28, fontSize: 22, color: "#a1a1aa", maxWidth: 920, lineHeight: 1.35 }}>
          Seasons, players, coaches, longreads — franchise depth with honest data boundaries.
        </div>
      </div>
    ),
    { ...size },
  );
}

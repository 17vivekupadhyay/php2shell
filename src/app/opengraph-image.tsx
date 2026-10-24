import { ImageResponse } from "next/og";

export const alt = "php2shell — PHP2Shell CVE-2026-109618 / CVE-2026-109619 interactive breakdown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(220,38,38,0.22), transparent 55%), radial-gradient(circle at 85% 85%, rgba(220,38,38,0.12), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "7px 18px",
              borderRadius: 999,
              border: "1px solid rgba(239,68,68,0.5)",
              backgroundColor: "rgba(239,68,68,0.12)",
              color: "#fca5a5",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Live incident · October 2026
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          PHP <span style={{ color: "#ef4444", margin: "0 20px" }}>→</span> Shell
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#a1a1aa",
            marginTop: 24,
            maxWidth: 980,
          }}
        >
          An interactive breakdown of PHP2Shell — CVE-2026-109618 &amp; CVE-2026-109619
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 40,
          }}
        >
          {["CVE-2026-109618", "CVE-2026-109619", "CVSS 9.2"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e4e4e7",
                fontSize: 22,
                fontFamily: "monospace",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

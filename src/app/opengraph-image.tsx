import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1b1530 0%, #0f0c1d 100%)",
          padding: "80px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            color: "#b69dff",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#8a6dff",
            }}
          />
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            {siteConfig.name}
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: "#c9c4d6" }}>
            CS + Mathematics · Junior Software Developer
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#8f88a3" }}>
          TypeScript · React · Next.js · Python
        </div>
      </div>
    ),
    { ...size },
  );
}

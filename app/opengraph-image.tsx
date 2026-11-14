import { ImageResponse } from "next/og";

export const alt = "TECHGENSHUB Creator Toolkit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #070b18 0%, #04050b 60%, #1b1140 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 10, color: "#38bdf8", display: "flex" }}>TECHGENSHUB</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 24, display: "flex" }}>Create More.</div>
        <div style={{ fontSize: 96, fontWeight: 800, color: "#a78bfa", display: "flex" }}>Grow Faster.</div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 32, display: "flex" }}>Free creator tools for India and the world</div>
      </div>
    ),
    size,
  );
}

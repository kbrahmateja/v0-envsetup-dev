import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "EnvSetup.dev — Generate Dev Environments in Seconds"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 50%, #0f0f0f 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid dots */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15,
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          display: "flex",
        }} />

        {/* Top badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
          borderRadius: "24px", padding: "6px 16px", marginBottom: "24px",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", display: "flex" }} />
          <span style={{ color: "#a5b4fc", fontSize: "16px", fontWeight: 500 }}>
            322 Templates • 21 Languages • Free
          </span>
        </div>

        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{
            width: "56px", height: "56px", background: "#6366f1", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: 700, color: "white",
          }}>
            {"<>"}
          </div>
          <span style={{ color: "white", fontSize: "36px", fontWeight: 700, letterSpacing: "-1px" }}>
            EnvSetup.dev
          </span>
        </div>

        {/* Main headline */}
        <h1 style={{
          color: "white", fontSize: "64px", fontWeight: 800,
          textAlign: "center", lineHeight: 1.1, margin: "0 0 16px",
          letterSpacing: "-2px", maxWidth: "900px",
          display: "flex",
        }}>
          Generate Dev Environments
          <br />
          <span style={{ color: "#6366f1" }}>in Seconds</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "#9ca3af", fontSize: "24px", textAlign: "center",
          margin: "0 0 40px", maxWidth: "700px", display: "flex",
        }}>
          Dockerfile • docker-compose • .env — AI-powered, all auto-generated
        </p>

        {/* Tech stack pills */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", maxWidth: "800px" }}>
          {["Next.js", "FastAPI", "Django", "Spring Boot", "Go", "Rust", "Laravel", "Rails"].map(tech => (
            <div key={tech} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "6px 14px",
              color: "#e5e7eb", fontSize: "15px", fontWeight: 500,
              display: "flex",
            }}>
              {tech}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div style={{
          position: "absolute", bottom: "28px",
          color: "#4b5563", fontSize: "16px", display: "flex",
        }}>
          envsetup.dev
        </div>
      </div>
    ),
    { ...size }
  )
}

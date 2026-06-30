import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "Arifin Docs & Design — Jasa Dokumen Profesional";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const logoData = await fetch(
    new URL("../../public/logo-og.png", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #7c3aed 100%)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24, border: "2px solid rgba(255,255,255,0.3)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={80} height={80} style={{ objectFit: "cover" }} />
        </div>

        {/* Brand name */}
        <div style={{ fontSize: 48, fontWeight: 900, color: "white", marginBottom: 12 }}>
          Arifin Docs & Design
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 24, color: "rgba(191,219,254,0.9)", marginBottom: 32 }}>
          Jasa Dokumen Profesional #1
        </div>

        {/* Services pills */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {["CV ATS Friendly", "Surat Lamaran", "Surat Legal", "NPWP Online"].map((s) => (
            <div key={s} style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 999, padding: "8px 20px",
              color: "white", fontSize: 18,
            }}>
              {s}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: "absolute", bottom: 32,
          color: "rgba(191,219,254,0.7)", fontSize: 18,
        }}>
          arifindocs.id
        </div>
      </div>
    ),
    { ...size }
  );
}
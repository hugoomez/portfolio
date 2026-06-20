import Link from "next/link";

// Global fallback for paths that don't match any locale segment.
// Must provide its own <html>/<body> because the only root layout lives
// under [locale]/layout.tsx.
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          gap: "1rem",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>404 — Page not found</h1>
        <p style={{ color: "#666", margin: 0 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" style={{ color: "#6d49d6" }}>
          Back to home
        </Link>
      </body>
    </html>
  );
}

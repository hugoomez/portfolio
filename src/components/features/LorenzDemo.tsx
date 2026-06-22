"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Formula } from "./MathFormula";

const W = 560, H = 300;
const DT = 0.005, SPF = 6, TRAIL = 5000;

// RK4 integration of the Lorenz system
function rk4(
  x: number, y: number, z: number,
  σ: number, ρ: number, β: number,
  dt: number,
): [number, number, number] {
  const f = (x: number, y: number, z: number) =>
    [σ * (y - x), x * (ρ - z) - y, x * y - β * z] as const;
  const [k1x, k1y, k1z] = f(x, y, z);
  const [k2x, k2y, k2z] = f(x + k1x * dt / 2, y + k1y * dt / 2, z + k1z * dt / 2);
  const [k3x, k3y, k3z] = f(x + k2x * dt / 2, y + k2y * dt / 2, z + k2z * dt / 2);
  const [k4x, k4y, k4z] = f(x + k3x * dt, y + k3y * dt, z + k3z * dt);
  return [
    x + dt * (k1x + 2 * k2x + 2 * k3x + k4x) / 6,
    y + dt * (k1y + 2 * k2y + 2 * k3y + k4y) / 6,
    z + dt * (k1z + 2 * k2z + 2 * k3z + k4z) / 6,
  ];
}

// Project attractor (x, z) to canvas — x ∈ [-25,25], z ∈ [0,55]
const toX = (x: number) => W / 2 + x * (W / 58);
const toY = (z: number) => H - 8 - (z / 55) * (H - 16);

export function LorenzDemo() {
  const t = useTranslations("Math");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [sigma, setSigma] = useState(10);
  const [rho, setRho] = useState(28);

  const s = useRef({
    x: 0.1, y: 0, z: 20,
    trail: [] as [number, number][],
    playing: true, sigma: 10, rho: 28,
  });

  useEffect(() => { s.current.playing = playing; }, [playing]);
  useEffect(() => {
    Object.assign(s.current, { sigma, rho, x: 0.1, y: 0, z: 20, trail: [] });
  }, [sigma, rho]);

  const reset = useCallback(() => {
    Object.assign(s.current, { x: 0.1, y: 0, z: 20, trail: [] });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    let accent = "99,102,241";
    const syncColor = () => {
      const el = document.createElement("span");
      el.style.color = "var(--accent)";
      document.body.appendChild(el);
      const m = getComputedStyle(el).color.match(/\d+/g);
      if (m) accent = m.slice(0, 3).join(",");
      document.body.removeChild(el);
    };
    syncColor();
    const mo = new MutationObserver(syncColor);
    mo.observe(document.documentElement, { attributeFilter: ["class"] });

    let raf: number;
    function draw() {
      const { trail } = s.current;

      if (s.current.playing) {
        for (let i = 0; i < SPF; i++) {
          const [nx, ny, nz] = rk4(
            s.current.x, s.current.y, s.current.z,
            s.current.sigma, s.current.rho, 8 / 3, DT,
          );
          s.current.x = nx; s.current.y = ny; s.current.z = nz;
          trail.push([nx, nz]);
          if (trail.length > TRAIL) trail.shift();
        }
      }

      ctx.clearRect(0, 0, W, H);

      const n = trail.length;
      if (n > 1) {
        // Render trail in opacity chunks for performance
        const CHUNKS = 25;
        const cs = Math.ceil(n / CHUNKS);
        for (let c = 0; c < CHUNKS; c++) {
          const alpha = (c + 1) / CHUNKS;
          const start = c * cs;
          const end = Math.min(start + cs + 1, n);
          if (start >= n) break;
          ctx.beginPath();
          ctx.moveTo(toX(trail[start][0]), toY(trail[start][1]));
          for (let i = start + 1; i < end; i++) {
            ctx.lineTo(toX(trail[i][0]), toY(trail[i][1]));
          }
          ctx.strokeStyle = `rgba(${accent},${alpha * 0.88})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
        // Current point dot
        const [lx, lz] = trail[n - 1];
        ctx.beginPath();
        ctx.arc(toX(lx), toY(lz), 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${accent})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("lorenzTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("lorenzDescription")}</p>
      <div className="mt-4 text-sm">
        <Formula math={"\\dot x=\\sigma(y{-}x),\\;\\dot y=x(\\rho{-}z){-}y,\\;\\dot z=xy{-}\\tfrac{8}{3}z"} />
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mt-4 w-full rounded-lg bg-muted/40"
        aria-label="Lorenz attractor animation"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80"
          aria-label="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">σ: {sigma}</span>
          <input
            type="range" min={1} max={20} step={0.5} value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="w-24 accent-[var(--color-accent)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">ρ: {rho}</span>
          <input
            type="range" min={10} max={50} step={0.5} value={rho}
            onChange={(e) => setRho(Number(e.target.value))}
            className="w-24 accent-[var(--color-accent)]"
          />
        </label>
        <p className="font-mono text-xs text-muted-foreground">
          {t("lorenzHint")}
        </p>
      </div>
    </div>
  );
}

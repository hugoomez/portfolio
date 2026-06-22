"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Formula } from "./MathFormula";

const W = 560;
const H = 300;
const CX = 128;           // center of epicycles
const CY = H / 2;
const SCALE = 82;         // fundamental amplitude in px
const WAVE_X0 = CX * 2 + 16;
const SPEED = 1.3;        // rad/s for fundamental

/** Resolve a CSS custom property to an rgb() string via a hidden span. */
function resolveVar(name: string): string {
  const el = document.createElement("span");
  el.style.color = `var(${name})`;
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color;
}

/** Convert rgb(r,g,b) → rgba(r,g,b,a). */
function rgba(rgb: string, a: number): string {
  return rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
}

export function FourierDemo() {
  const t = useTranslations("Math");
  const [terms, setTerms] = useState(5);
  const [playing, setPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable animation state shared with the rAF loop (avoids stale closures).
  const state = useRef({ time: 0, wave: [] as number[], playing: true, terms: 5 });
  useEffect(() => { state.current.playing = playing; }, [playing]);
  useEffect(() => { state.current.terms = terms; state.current.wave = []; }, [terms]);

  const reset = useCallback(() => { state.current.time = 0; state.current.wave = []; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    // Cache resolved colors; update on theme switch.
    let accent = "rgb(99,102,241)";
    let muted = "rgb(107,114,128)";
    function updateColors() {
      accent = resolveVar("--accent");
      muted  = resolveVar("--muted-foreground");
    }
    updateColors();
    const mo = new MutationObserver(updateColors);
    mo.observe(document.documentElement, { attributeFilter: ["class"] });

    let lastTs: number | null = null;
    let raf: number;

    function draw(ts: number) {
      if (lastTs === null) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      if (state.current.playing) state.current.time += dt * SPEED;

      const { time, wave, terms } = state.current;

      ctx.clearRect(0, 0, W, H);

      // Faint guide lines
      ctx.beginPath();
      ctx.moveTo(WAVE_X0, 0);
      ctx.lineTo(WAVE_X0, H);
      ctx.strokeStyle = rgba(muted, 0.1);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(WAVE_X0, CY);
      ctx.lineTo(W, CY);
      ctx.strokeStyle = rgba(muted, 0.1);
      ctx.stroke();

      // Target square wave (faint dashed)
      ctx.beginPath();
      const sqPts = W - WAVE_X0;
      for (let i = 0; i < sqPts; i++) {
        const phase = time - (i / sqPts) * (2 * Math.PI);
        // approximate the period from the wave data length and speed
        const sqY = CY + (Math.sin(phase) >= 0 ? -1 : 1) * SCALE * (4 / Math.PI);
        const clampedY = Math.max(4, Math.min(H - 4, sqY));
        if (i === 0) ctx.moveTo(WAVE_X0 + i, clampedY);
        else ctx.lineTo(WAVE_X0 + i, clampedY);
      }
      ctx.strokeStyle = rgba(muted, 0.18);
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Epicircles
      let cx = CX, cy = CY;
      for (let k = 0; k < terms; k++) {
        const freq = 2 * k + 1;
        const amp  = (SCALE * (4 / Math.PI)) / freq;
        const nx   = cx + amp * Math.cos(freq * time);
        const ny   = cy + amp * Math.sin(freq * time);

        // Circle
        ctx.beginPath();
        ctx.arc(cx, cy, amp, 0, 2 * Math.PI);
        ctx.strokeStyle = rgba(muted, k === 0 ? 0.35 : 0.18);
        ctx.lineWidth = k === 0 ? 1.5 : 1;
        ctx.stroke();

        // Arm
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = rgba(muted, 0.65);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        cx = nx;
        cy = ny;
      }

      // Tip dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = accent;
      ctx.fill();

      // Accumulate wave
      if (state.current.playing) {
        state.current.wave.unshift(cy);
        const maxLen = W - WAVE_X0 - 2;
        if (state.current.wave.length > maxLen) state.current.wave.length = maxLen;
      }

      // Connector dashed line from tip to wave start
      if (wave.length > 0) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(WAVE_X0, wave[0]);
        ctx.strokeStyle = rgba(accent, 0.3);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Wave
      if (wave.length > 1) {
        ctx.beginPath();
        ctx.moveTo(WAVE_X0, wave[0]);
        for (let i = 1; i < wave.length; i++) ctx.lineTo(WAVE_X0 + i, wave[i]);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("fourierTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("fourierDescription")}</p>

      <div className="mt-4 text-sm">
        <Formula math={"f(x) = \\frac{4}{\\pi} \\sum_{k=1}^{n} \\frac{\\sin((2k-1)x)}{2k-1}"} />
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mt-4 w-full rounded-lg bg-muted/40"
        aria-label="Fourier series epicycle animation"
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
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-xs text-muted-foreground">
            {t("terms")}: {terms}
          </span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={terms}
            onChange={(e) => setTerms(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </label>
      </div>
    </div>
  );
}

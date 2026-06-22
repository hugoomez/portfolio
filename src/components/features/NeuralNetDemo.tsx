"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play, RotateCcw } from "lucide-react";

const W = 560, H = 360, GRID = 50;

// ── Minimal 2 → 8 → 1 neural network ──────────────────────────────────────
const sig = (x: number) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
const relu = (x: number) => Math.max(0, x);

interface Net { W1: number[][]; b1: number[]; W2: number[]; b2: number }

function mkNet(): Net {
  const r = () => (Math.random() - 0.5) * 0.8;
  return {
    W1: Array.from({ length: 8 }, () => [r(), r()]),
    b1: Array(8).fill(0),
    W2: Array.from({ length: 8 }, () => r()),
    b2: 0,
  };
}

function fwd(net: Net, x: number, y: number) {
  const h = net.W1.map((w, i) => relu(w[0] * x + w[1] * y + net.b1[i]));
  const z = net.W2.reduce((s, w, i) => s + w * h[i], 0) + net.b2;
  return { h, out: sig(z) };
}

type Pt = { x: number; y: number; label: 0 | 1 };

function trainStep(net: Net, pts: Pt[], lr = 0.05): number {
  if (!pts.length) return 0;
  const dW1 = net.W1.map(() => [0, 0]);
  const db1 = Array(8).fill(0);
  const dW2 = Array(8).fill(0);
  let db2 = 0, loss = 0;

  for (const p of pts) {
    const { h, out } = fwd(net, p.x, p.y);
    loss -= p.label * Math.log(out + 1e-7) + (1 - p.label) * Math.log(1 - out + 1e-7);
    const dOut = out - p.label;
    for (let i = 0; i < 8; i++) {
      dW2[i] += dOut * h[i];
      db2 += dOut;
      const dh = dOut * net.W2[i] * (h[i] > 0 ? 1 : 0);
      dW1[i][0] += dh * p.x;
      dW1[i][1] += dh * p.y;
      db1[i] += dh;
    }
  }

  const n = pts.length;
  for (let i = 0; i < 8; i++) {
    net.W1[i][0] -= lr * dW1[i][0] / n;
    net.W1[i][1] -= lr * dW1[i][1] / n;
    net.b1[i]    -= lr * db1[i] / n;
    net.W2[i]    -= lr * dW2[i] / n;
  }
  net.b2 -= lr * db2 / n;
  return loss / n;
}

// Canvas pixel → net coordinate in [-1, 1]
const toNet = (cx: number, cy: number): [number, number] =>
  [(cx / W) * 2 - 1, 1 - (cy / H) * 2];

// ── Component ──────────────────────────────────────────────────────────────
export function NeuralNetDemo() {
  const t = useTranslations("Math");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loss, setLoss]   = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const sr = useRef({ net: mkNet(), pts: [] as Pt[], playing: false, frame: 0 });

  useEffect(() => { sr.current.playing = playing; }, [playing]);

  const reset = useCallback(() => {
    Object.assign(sr.current, { net: mkNet(), pts: [], playing: false, frame: 0 });
    setPlaying(false);
    setLoss(null);
    setCount(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    // Offscreen canvas stores the cached decision-boundary grid
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    const maybeOff = off.getContext("2d");
    if (!maybeOff) return;
    const offCtx = maybeOff;

    let accentRgb = "99,102,241";
    const syncColor = () => {
      const el = document.createElement("span");
      el.style.color = "var(--accent)";
      document.body.appendChild(el);
      const m = getComputedStyle(el).color.match(/\d+/g);
      if (m) accentRgb = m.slice(0, 3).join(",");
      document.body.removeChild(el);
    };
    syncColor();
    const mo = new MutationObserver(syncColor);
    mo.observe(document.documentElement, { attributeFilter: ["class"] });

    const TRAIN_PER_FRAME = 15;
    const GRID_EVERY = 4;     // repaint boundary every N frames

    let raf: number;
    function draw() {
      const s = sr.current;
      s.frame++;

      // ── Train ─────────────────────────────────────────────────────────
      if (s.playing && s.pts.length > 0) {
        let l = 0;
        for (let i = 0; i < TRAIN_PER_FRAME; i++) l = trainStep(s.net, s.pts);
        if (s.frame % 5 === 0) setLoss(l);
      }

      // ── Recompute boundary heatmap ─────────────────────────────────────
      if (s.frame % GRID_EVERY === 0 || s.frame === 1) {
        offCtx.clearRect(0, 0, W, H);
        const cw = W / GRID, ch = H / GRID;
        for (let gy = 0; gy < GRID; gy++) {
          for (let gx = 0; gx < GRID; gx++) {
            const [nx, ny] = toNet((gx + 0.5) * cw, (gy + 0.5) * ch);
            const o = fwd(s.net, nx, ny).out;
            offCtx.fillStyle = o > 0.5
              ? `rgba(249,115,22,${(o - 0.5) * 2 * 0.35})`
              : `rgba(${accentRgb},${(0.5 - o) * 2 * 0.35})`;
            offCtx.fillRect(gx * cw, gy * ch, cw, ch);
          }
        }
      }

      // ── Render ────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(off, 0, 0);

      for (const p of s.pts) {
        const cx = ((p.x + 1) / 2) * W;
        const cy = ((1 - p.y) / 2) * H;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle  = p.label === 0 ? `rgba(${accentRgb},0.9)` : "rgba(249,115,22,0.9)";
        ctx.strokeStyle = "white";
        ctx.lineWidth  = 2;
        ctx.fill();
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const [nx, ny] = toNet(
      (e.clientX - rect.left) * (W / rect.width),
      (e.clientY - rect.top)  * (H / rect.height),
    );
    sr.current.pts.push({ x: nx, y: ny, label: e.button === 2 ? 1 : 0 });
    sr.current.playing = true;
    setPlaying(true);
    setCount((c) => c + 1);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("nnTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("nnDescription")}</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mt-4 w-full cursor-crosshair rounded-lg bg-muted/40"
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Neural network decision boundary visualiser"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={count === 0}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80 disabled:opacity-40"
          aria-label={playing ? "Pause training" : "Resume training"}
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
        <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            {t("nnClass0")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
            {t("nnClass1")}
          </span>
          {loss !== null && <span>loss: {loss.toFixed(4)}</span>}
        </div>
      </div>
      {count === 0 && (
        <p className="mt-2 text-xs italic text-muted-foreground">{t("nnHint")}</p>
      )}
    </div>
  );
}

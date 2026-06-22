"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { Formula } from "./MathFormula";

const f   = (x: number) => (x - 1) ** 2 + 0.5;
const df  = (x: number) => 2 * (x - 1);

const X_MIN = -4,  X_MAX = 4;
const Y_MIN = 0,   Y_MAX = 12;
const W = 480,     H = 300,  PAD = 8;
const MAX_STEPS = 30;
const CH = 72; // convergence chart height

const sx = (x: number) => PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const sy = (y: number) => H   - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);
const xFromSvg = (svgX: number) =>
  Math.max(X_MIN, Math.min(X_MAX, X_MIN + ((svgX - PAD) / (W - 2 * PAD)) * (X_MAX - X_MIN)));

export function GradientDescentDemo() {
  const t = useTranslations("Math");
  const [eta, setEta]           = useState(0.3);
  const [x0,  setX0]            = useState(-3);
  const [step, setStep]         = useState(0);
  const [playing, setPlaying]   = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // All iterates (precomputed for current η and x₀)
  const iterates = useMemo(() => {
    const xs = [x0];
    let x = x0;
    for (let i = 0; i < MAX_STEPS; i++) { x -= eta * df(x); xs.push(x); }
    return xs;
  }, [eta, x0]);

  const displayed = iterates.slice(0, step + 1);
  const xn = iterates[step];
  const yn = f(xn);
  const grad = df(xn);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    if (step >= MAX_STEPS) { setPlaying(false); return; }
    const id = setTimeout(() => setStep((s) => s + 1), 110);
    return () => clearTimeout(id);
  }, [playing, step]);

  const handleReset = useCallback(() => { setStep(0); setPlaying(false); }, []);
  const handleStep  = useCallback(() => { setPlaying(false); setStep((s) => Math.min(s + 1, MAX_STEPS)); }, []);

  // Click on SVG → set x₀
  const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newX0 = xFromSvg((e.clientX - rect.left) * (W / rect.width));
    setX0(parseFloat(newX0.toFixed(1)));
    setStep(0);
    setPlaying(false);
  }, []);

  // Curve
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = X_MIN + (i / 120) * (X_MAX - X_MIN);
      pts.push(`${sx(x).toFixed(1)},${sy(Math.min(f(x), Y_MAX)).toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  }, []);

  // Tangent line at xn (shows gradient)
  const tLen = 0.7;
  const tx1 = sx(xn - tLen), ty1 = sy(Math.min(yn + grad * (-tLen), Y_MAX));
  const tx2 = sx(xn + tLen), ty2 = sy(Math.min(yn + grad * tLen,   Y_MAX));

  // Next iterate for step arrow
  const xNext = iterates[Math.min(step + 1, MAX_STEPS)];

  // Convergence chart
  const losses = displayed.map((x) => f(x));
  const maxLoss = Math.max(...losses, 1);
  const clx = (i: number) => PAD + (i / MAX_STEPS) * (W - 2 * PAD);
  const cly = (l: number) => CH - PAD - (Math.min(l, maxLoss) / maxLoss) * (CH - 2 * PAD);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("descentTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("descentDescription")}</p>

      <div className="mt-4 text-sm">
        <Formula math={"x_{n+1} = x_n - \\eta\\, f'(x_n), \\quad f(x) = (x-1)^2 + 0.5"} />
      </div>

      {/* Main chart */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full cursor-crosshair rounded-lg bg-muted/40"
        aria-label="Gradient descent. Click to set start point."
        onClick={handleSvgClick}
      >
        {/* Minimum dashed line */}
        <line x1={sx(1)} y1={PAD} x2={sx(1)} y2={H - PAD}
          stroke="var(--color-border)" strokeDasharray="4 4" />
        <text x={sx(1) + 4} y={PAD + 13} fontSize={9}
          fill="var(--color-muted-foreground)" fontFamily="monospace">min</text>

        {/* Parabola */}
        <path d={curvePath} fill="none" stroke="var(--color-accent)" strokeWidth={2} />

        {/* Tangent line at current point (gradient direction) */}
        <line x1={tx1} y1={ty1} x2={tx2} y2={ty2}
          stroke="var(--color-muted-foreground)" strokeWidth={1.5}
          strokeDasharray="5 3" opacity={0.65} />

        {/* Drop line from current point */}
        <line x1={sx(xn)} y1={sy(yn)} x2={sx(xn)} y2={sy(0)}
          stroke="var(--color-accent)" strokeWidth={1} opacity={0.25} />

        {/* Step arrow: xn → xn+1 near x-axis */}
        {step < MAX_STEPS && xn !== xNext && (
          <>
            <line
              x1={sx(xn)} y1={sy(0) + 14}
              x2={sx(xNext)} y2={sy(0) + 14}
              stroke="var(--color-foreground)" strokeWidth={1.5} opacity={0.45}
            />
            <polygon
              points={`
                ${sx(xNext)},${sy(0) + 14}
                ${sx(xNext) + (xNext < xn ? 5 : -5)},${sy(0) + 11}
                ${sx(xNext) + (xNext < xn ? 5 : -5)},${sy(0) + 17}
              `}
              fill="var(--color-foreground)" opacity={0.45}
            />
          </>
        )}

        {/* Iterate trail */}
        {displayed.length > 1 && (
          <path
            d={`M${displayed.map((x) => `${sx(x).toFixed(1)},${sy(Math.min(f(x), Y_MAX)).toFixed(1)}`).join(" L")}`}
            fill="none" stroke="var(--color-foreground)"
            strokeWidth={1} strokeDasharray="2 3" opacity={0.35}
          />
        )}

        {/* Dots */}
        {displayed.map((x, i) => (
          <circle
            key={i}
            cx={sx(x)} cy={sy(Math.min(f(x), Y_MAX))}
            r={i === displayed.length - 1 ? 5.5 : 3}
            fill={i === displayed.length - 1 ? "var(--color-accent)" : "var(--color-foreground)"}
            opacity={i === displayed.length - 1 ? 1 : 0.25 + (0.55 * i) / displayed.length}
          />
        ))}
      </svg>

      {/* Convergence mini-chart */}
      {losses.length > 1 && (
        <svg viewBox={`0 0 ${W} ${CH}`} className="mt-1.5 w-full rounded-lg bg-muted/20">
          <text x={PAD} y={13} fontSize={9}
            fill="var(--color-muted-foreground)" fontFamily="monospace">
            {t("convergence")}
          </text>
          {/* Fill under curve */}
          <path
            d={[
              `M${clx(0).toFixed(1)},${CH - PAD}`,
              ...losses.map((l, i) => `L${clx(i).toFixed(1)},${cly(l).toFixed(1)}`),
              `L${clx(losses.length - 1).toFixed(1)},${CH - PAD}`,
              "Z",
            ].join(" ")}
            fill="var(--color-accent)" opacity={0.08}
          />
          <polyline
            points={losses.map((l, i) => `${clx(i).toFixed(1)},${cly(l).toFixed(1)}`).join(" ")}
            fill="none" stroke="var(--color-accent)" strokeWidth={1.5}
          />
          <circle
            cx={clx(losses.length - 1)} cy={cly(losses[losses.length - 1])}
            r={3} fill="var(--color-accent)"
          />
          <text
            x={clx(losses.length - 1) + 5}
            y={cly(losses[losses.length - 1]) + 4}
            fontSize={9} fill="var(--color-accent)" fontFamily="monospace"
          >
            {losses[losses.length - 1].toFixed(3)}
          </text>
        </svg>
      )}

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label={playing ? "Pause" : "Play"}
            onClick={() => { if (step >= MAX_STEPS) setStep(0); setPlaying((p) => !p); }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80">
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button type="button" aria-label="Step" onClick={handleStep}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80">
            <StepForward className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="Reset" onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted transition-colors hover:bg-muted/80">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <Slider
            label={`${t("learningRate")}: ${eta.toFixed(2)}`}
            min={0.01} max={1.05} step={0.01} value={eta}
            onChange={(v) => { setEta(v); setStep(0); setPlaying(false); }}
          />
          <Slider
            label={`${t("startPoint")}: ${x0.toFixed(1)}`}
            min={-4} max={4} step={0.1} value={x0}
            onChange={(v) => { setX0(v); setStep(0); setPlaying(false); }}
          />
        </div>
      </div>

      <p className="mt-3 font-mono text-xs text-muted-foreground">
        n = {step} · x = {xn.toFixed(4)} · f(x) = {yn.toFixed(4)}
        {eta >= 1 && "  ·  η ≥ 1 → diverge / oscillate"}
        {step === 0 && `  ·  ${t("clickHint")}`}
      </p>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange }: {
  label: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-muted-foreground">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]" />
    </label>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Formula } from "./MathFormula";

// Objective: f(x) = (x - 1)^2 + 0.5, minimum at x = 1. f'(x) = 2(x - 1).
const f = (x: number) => (x - 1) ** 2 + 0.5;
const df = (x: number) => 2 * (x - 1);

const X_MIN = -4;
const X_MAX = 4;
const Y_MIN = 0;
const Y_MAX = 12;
const W = 480;
const H = 300;
const PAD = 8;

const sx = (x: number) =>
  PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const sy = (y: number) =>
  H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);

export function GradientDescentDemo() {
  const t = useTranslations("Math");
  const [eta, setEta] = useState(0.1);
  const [x0, setX0] = useState(-3);
  const [steps, setSteps] = useState(10);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = X_MIN + (i / 120) * (X_MAX - X_MIN);
      pts.push(`${sx(x).toFixed(1)},${sy(Math.min(f(x), Y_MAX)).toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  }, []);

  const iterates = useMemo(() => {
    const xs: number[] = [x0];
    let x = x0;
    for (let i = 0; i < steps; i++) {
      x = x - eta * df(x);
      xs.push(x);
    }
    return xs;
  }, [eta, x0, steps]);

  const last = iterates[iterates.length - 1];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("descentTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("descentDescription")}
      </p>

      <div className="mt-4 text-sm">
        <Formula math={"x_{n+1} = x_n - \\eta\\, f'(x_n), \\quad f(x) = (x-1)^2 + 0.5"} />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full rounded-lg bg-muted/40"
        role="img"
        aria-label="Gradient descent on a quadratic function"
      >
        {/* minimum marker */}
        <line
          x1={sx(1)}
          y1={PAD}
          x2={sx(1)}
          y2={H - PAD}
          stroke="var(--color-border)"
          strokeDasharray="4 4"
        />
        <path d={curve} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
        {/* iterate path */}
        <path
          d={`M${iterates
            .map((x) => `${sx(x).toFixed(1)},${sy(Math.min(f(x), Y_MAX)).toFixed(1)}`)
            .join(" L")}`}
          fill="none"
          stroke="var(--color-foreground)"
          strokeWidth={1}
          strokeDasharray="2 3"
          opacity={0.5}
        />
        {iterates.map((x, i) => (
          <circle
            key={i}
            cx={sx(x)}
            cy={sy(Math.min(f(x), Y_MAX))}
            r={i === iterates.length - 1 ? 5 : 3}
            fill={
              i === iterates.length - 1
                ? "var(--color-accent)"
                : "var(--color-foreground)"
            }
            opacity={i === iterates.length - 1 ? 1 : 0.35 + (0.5 * i) / iterates.length}
          />
        ))}
      </svg>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Slider
          label={`${t("learningRate")}: ${eta.toFixed(2)}`}
          min={0.01}
          max={1.05}
          step={0.01}
          value={eta}
          onChange={setEta}
        />
        <Slider
          label={`${t("startPoint")}: ${x0.toFixed(1)}`}
          min={-4}
          max={4}
          step={0.1}
          value={x0}
          onChange={setX0}
        />
        <Slider
          label={`${t("steps")}: ${steps}`}
          min={1}
          max={30}
          step={1}
          value={steps}
          onChange={(v) => setSteps(Math.round(v))}
        />
      </div>

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        x<sub>{steps}</sub> = {last.toFixed(4)} · f(x) = {f(last).toFixed(4)}
        {eta >= 1 && " · η ≥ 1 → diverge / oscillate"}
      </p>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-accent)]"
      />
    </label>
  );
}

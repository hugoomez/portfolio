"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Formula } from "./MathFormula";

const W = 480;
const H = 260;
const PAD = 12;
const X_MIN = -Math.PI;
const X_MAX = Math.PI;
const Y_MIN = -1.5;
const Y_MAX = 1.5;

const sx = (x: number) =>
  PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const sy = (y: number) =>
  H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);

// Square wave via odd harmonics: (4/π) Σ sin((2k-1)x)/(2k-1).
const partialSum = (x: number, terms: number) => {
  let s = 0;
  for (let k = 1; k <= terms; k++) {
    const n = 2 * k - 1;
    s += Math.sin(n * x) / n;
  }
  return (4 / Math.PI) * s;
};

const target = (x: number) => (Math.sin(x) >= 0 ? 1 : -1);

function pathFor(fn: (x: number) => number) {
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = X_MIN + (i / 240) * (X_MAX - X_MIN);
    const y = Math.max(Y_MIN, Math.min(Y_MAX, fn(x)));
    pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

export function FourierDemo() {
  const t = useTranslations("Math");
  const [terms, setTerms] = useState(3);

  const approx = useMemo(() => pathFor((x) => partialSum(x, terms)), [terms]);
  const square = useMemo(() => pathFor(target), []);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-xl font-semibold">{t("fourierTitle")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("fourierDescription")}
      </p>

      <div className="mt-4 text-sm">
        <Formula math={"f(x) = \\frac{4}{\\pi} \\sum_{k=1}^{n} \\frac{\\sin((2k-1)x)}{2k-1}"} />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full rounded-lg bg-muted/40"
        role="img"
        aria-label="Fourier series approximation of a square wave"
      >
        <line
          x1={PAD}
          y1={sy(0)}
          x2={W - PAD}
          y2={sy(0)}
          stroke="var(--color-border)"
        />
        <path
          d={square}
          fill="none"
          stroke="var(--color-muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
        <path d={approx} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
      </svg>

      <div className="mt-5">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-muted-foreground">
            {t("terms")}: {terms}
          </span>
          <input
            type="range"
            min={1}
            max={25}
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

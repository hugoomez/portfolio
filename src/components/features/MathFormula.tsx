"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

export function Formula({ math }: { math: string }) {
  return <BlockMath math={math} />;
}

export function InlineFormula({ math }: { math: string }) {
  return <InlineMath math={math} />;
}

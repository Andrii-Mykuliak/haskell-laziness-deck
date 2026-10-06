import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { At, Chip } from "../deck/ui";

/* Final slide: fibs is forced one element at a time; every new element adds a square to the Fibonacci spiral. */

const SLOW = 1.5;
const K = 18;
const SQ_START = 24 * SLOW;
const SQ_STEP = 15 * SLOW;
const SQ_DUR = 14 * SLOW;
const DONE_AT = SQ_START + (K - 1) * SQ_STEP + SQ_DUR;
const VIEW = { x: 930, y: 70, w: 920, h: 940 };

const FIB = (() => {
  const out = [1, 1];
  while (out.length < K) out.push(out[out.length - 1] + out[out.length - 2]);
  return out;
})();

type Box = { x0: number; y0: number; x1: number; y1: number };
type Sq = { a: number; b: number; s: number; cx: number; cy: number; sx: number; sy: number; ex: number; ey: number; box: Box };

const SQUARES: Sq[] = (() => {
  const dirs = ["D", "R", "U", "L"];
  const out: Sq[] = [];
  let box: Box = { x0: 0, y0: 0, x1: 1, y1: 1 };
  FIB.forEach((s, i) => {
    const d = dirs[i % 4];
    let a = 0;
    let b = 0;
    if (i > 0) {
      if (d === "R") [a, b] = [box.x1, box.y0];
      if (d === "U") [a, b] = [box.x0, box.y1];
      if (d === "L") [a, b] = [box.x0 - s, box.y0];
      if (d === "D") [a, b] = [box.x0, box.y0 - s];
    }
    box = i === 0 ? box : { x0: Math.min(box.x0, a), y0: Math.min(box.y0, b), x1: Math.max(box.x1, a + s), y1: Math.max(box.y1, b + s) };
    const corner = {
      R: { c: [a, b + s], st: [a, b], en: [a + s, b + s] },
      U: { c: [a, b], st: [a + s, b], en: [a, b + s] },
      L: { c: [a + s, b], st: [a + s, b + s], en: [a, b] },
      D: { c: [a + s, b + s], st: [a, b + s], en: [a + s, b] },
    }[d]!;
    out.push({ a, b, s, cx: corner.c[0], cy: corner.c[1], sx: corner.st[0], sy: corner.st[1], ex: corner.en[0], ey: corner.en[1], box: { ...box } });
  });
  return out;
})();

const COLORS = ["#5e5086", "#6f5fa5", "#8d76dc", "#a994ff", "#b25fa8", "#c26cae", "#f38bbf", "#f59e72", "#f2c17d", "#86e0a8", "#6fd0c0", "#2474e2", "#5e8ef0", "#8d76dc", "#b25fa8", "#f38bbf", "#f2c17d", "#86e0a8"];

const rnd = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = Easing.out(Easing.cubic);

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: rnd(i * 5 + 1) * 1920,
  y: rnd(i * 7 + 2) * 1080,
  r: 1 + rnd(i * 11 + 3) * 2,
  v: 0.2 + rnd(i * 13 + 4) * 0.5,
  ph: rnd(i * 17 + 5) * 6.28,
}));

const camera = (f: number) => {
  const prog = SQUARES.map((_, i) => ease(clamp01((f - (SQ_START + i * SQ_STEP)) / SQ_DUR)));
  let n = prog.filter((p) => p > 0).length;
  if (n === 0) n = 1;
  const fit = (b: Box) => {
    const w = b.x1 - b.x0;
    const h = b.y1 - b.y0;
    const scale = Math.min(VIEW.w / w, VIEW.h / h) * 0.92;
    return { scale, mx: (b.x0 + b.x1) / 2, my: (b.y0 + b.y1) / 2 };
  };
  const cur = fit(SQUARES[n - 1].box);
  const prev = n > 1 ? fit(SQUARES[n - 2].box) : cur;
  const p = prog[n - 1];
  const scale = Math.exp(Math.log(prev.scale) + (Math.log(cur.scale) - Math.log(prev.scale)) * p);
  const mx = prev.mx + (cur.mx - prev.mx) * p;
  const my = prev.my + (cur.my - prev.my) * p;
  return { prog, n, scale, mx, my };
};

const Outro: React.FC = () => {
  const { s, frame: f } = useSteps();
  const { prog, n, scale, mx, my } = camera(f);
  const X = (x: number) => VIEW.x + VIEW.w / 2 + (x - mx) * scale;
  const Y = (y: number) => VIEW.y + VIEW.h / 2 - (y - my) * scale;
  const done = f >= DONE_AT;
  const glow = interpolate(f, [DONE_AT, DONE_AT + 40 * SLOW], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const credit = s(0, DONE_AT + 30 * SLOW);
  const sweep = interpolate(f, [DONE_AT + 40 * SLOW, DONE_AT + 90 * SLOW], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 2, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 50}px)` }}>
          {ch}
        </span>
      );
    });

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 72% 52%, rgba(141,118,220,${0.16 + 0.12 * glow}) 0%, ${C.bg} 60%)`,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {STARS.map((st, i) => (
          <circle key={i} cx={st.x} cy={(st.y - f * st.v + 1080 * 4) % 1080} r={st.r} fill="#c4b5fd" opacity={0.25 + 0.25 * Math.sin(f * 0.08 + st.ph)} />
        ))}
        {SQUARES.map((q, i) => {
          const p = prog[i];
          if (p <= 0) return null;
          const col = COLORS[i % COLORS.length];
          const side = q.s * scale;
          const x = X(q.a);
          const y = Y(q.b + q.s);
          const fs = Math.min(side * 0.36, 110);
          return (
            <g key={i} opacity={p}>
              <rect x={x} y={y} width={side} height={side} fill={col} fillOpacity={0.1 + 0.06 * glow} stroke={col} strokeWidth={3} />
              {fs > 14 && (
                <text
                  x={x + side / 2}
                  y={y + side / 2}
                  fill={col}
                  fontFamily={F.mono}
                  fontWeight={700}
                  fontSize={fs}
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity={0.85}
                >
                  {FIB[i]}
                </text>
              )}
            </g>
          );
        })}
        <g style={{ filter: `drop-shadow(0 0 ${12 * glow}px rgba(242,193,125,0.85))` }}>
          {SQUARES.map((q, i) => {
            const p = clamp01((f - (SQ_START + i * SQ_STEP + 4 * SLOW)) / SQ_DUR);
            if (p <= 0) return null;
            const r = q.s * scale;
            const len = (Math.PI / 2) * r;
            return (
              <path
                key={i}
                d={`M ${X(q.sx)} ${Y(q.sy)} A ${r} ${r} 0 0 0 ${X(q.ex)} ${Y(q.ey)}`}
                stroke={C.amber}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - ease(p))}
              />
            );
          })}
        </g>
      </svg>

      <div style={{ position: "absolute", left: 90, top: 150, fontFamily: F.head, fontWeight: 800, fontSize: 104, lineHeight: 1.12, color: C.text }}>
        <div>{letters("Дякую", 6)}</div>
        <div>{letters("за увагу!", 18)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 430,
          height: 6,
          width: 440 * s(0, 36),
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
        }}
      />
      <Code
        x={96}
        y={500}
        size={28}
        step={0}
        delay={30}
        code={`
          fibs = 0 : 1 :
            zipWith (+) fibs (tail fibs)
        `}
      />
      <At x={96} y={640} step={0} delay={44} dir="left" pop>
        <Chip size={34} color={done ? C.mint : C.amber} border={done ? C.mint : C.amber}>
          {done ? "решта – за потребою" : `take ${n + 1} fibs`}
        </Chip>
      </At>

      <div style={{ position: "absolute", left: 96, top: 900, opacity: credit, transform: `translateY(${(1 - credit) * 16}px)` }}>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [Math.ceil(DONE_AT + 140 * SLOW)], C: Outro };

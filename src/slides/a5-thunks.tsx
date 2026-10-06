import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Lead, M, Slide } from "../deck/ui";
import { clamp01 } from "./common";

/* 14 · Thunk: відкладене обчислення */
const STAGES: { label: string; on: [number, number] }[] = [
  { label: "створення", on: [2, 10] },
  { label: "очікування", on: [2, 34] },
  { label: "вимога значення", on: [3, 0] },
  { label: "оновлення", on: [3, 34] },
  { label: "повторне використання", on: [4, 0] },
];

const Stages: React.FC = () => {
  const { s } = useSteps();
  return (
    <div style={{ position: "absolute", left: 96, top: 330, display: "flex", alignItems: "center", gap: 18 }}>
      {STAGES.map((st, i) => {
        const p = s(1, i * 7, POP);
        const lit = s(st.on[0], st.on[1]);
        const next = STAGES[i + 1];
        const current = next ? lit * (1 - s(next.on[0], next.on[1])) : lit;
        const col = i === 2 ? C.amber : C.mint;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                padding: "14px 22px",
                borderRadius: 14,
                border: `3px solid ${lit > 0.5 ? col : C.line}`,
                background: `rgba(${i === 2 ? "242,193,125" : "134,224,168"},${0.16 * lit})`,
                color: lit > 0.5 ? col : C.dim,
                fontFamily: F.body,
                fontWeight: 700,
                fontSize: 30,
                whiteSpace: "nowrap",
                opacity: Math.min(1, p),
                transform: `translateY(${(1 - p) * 20}px) scale(${1 + 0.06 * current})`,
                boxShadow: current > 0.05 ? `0 0 ${28 * current}px ${col}` : undefined,
              }}
            >
              {st.label}
            </div>
            {next && <div style={{ color: C.faint, fontSize: 34, fontFamily: F.body, opacity: Math.min(1, p) }}>→</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ThunkBox: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { s } = useSteps();
  const p = s(2, 20, POP);
  const f = s(3, 30);
  const flash = f * (1 - s(3, 52));
  const reuse = s(4, 10) * (1 - s(4, 34));
  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: F.mono,
    fontWeight: 700,
    fontSize: 48,
    boxSizing: "border-box",
    fontVariantLigatures: "none",
  };
  const status = s(4, 0) > 0.5 ? "друге x: вже готове значення" : f > 0.5 ? "оновлено значенням" : "thunk: ще не обчислено";
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 90,
          top: y + 28,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 44,
          color: C.lav,
          opacity: Math.min(1, p),
        }}
      >
        x
      </div>
      <div style={{ position: "absolute", left: x, top: y, width: 380, height: 110, opacity: Math.min(1, p), transform: `scale(${mix(0.7, 1, p)})` }}>
        <div style={{ ...face, border: `3px dashed ${C.faint}`, color: C.dim, opacity: 1 - f }}>20 * 30</div>
        <div
          style={{
            ...face,
            border: `3px solid ${C.mint}`,
            background: "rgba(134,224,168,0.14)",
            color: C.mint,
            opacity: f,
            transform: `scale(${mix(0.7, 1, f)})`,
            boxShadow: `0 0 ${36 * Math.max(flash, reuse)}px ${C.mint}`,
          }}
        >
          600
        </div>
      </div>
      <div style={{ position: "absolute", left: x, top: y - 46, fontFamily: F.body, fontSize: 28, color: f > 0.5 ? C.mint : C.dim, opacity: clamp01(s(2, 30)) }}>
        {status}
      </div>
    </>
  );
};

const S14: React.FC = () => (
  <Slide title="Thunk: відкладене обчислення">
    <Lead>
      <A>Thunk</A> зберігає опис виразу та оточення, потрібне для його майбутнього обчислення.
    </Lead>
    <Stages />
    <Code
      x={96}
      y={500}
      size={60}
      step={2}
      code={`
        let x = 20 * 30
        in [[3|x]] + [[4|x]]
      `}
    />
    <ThunkBox x={880} y={500} />
    <Arrow x1={222} y1={690} x2={960} y2={618} step={3} delay={6} dur={18} color={C.amber} curve={70} />
    <Arrow x1={366} y1={690} x2={1060} y2={618} step={4} delay={4} dur={16} color={C.mint} curve={50} />
    <At x={96} y={860} w={1720} step={5} size={40}>
      Перше використання <M>x</M> обчислює 600; друге отримує <A>вже готове</A> значення.
    </At>
  </Slide>
);

/* 15 · Лінивість і хвостова рекурсія */
const TRACE: [string, string][] = [
  ["go 4 ", "1"],
  ["go 3 ", "(4 * 1)"],
  ["go 2 ", "(3 * (4 * 1))"],
  ["go 1 ", "(2 * (3 * (4 * 1)))"],
];

const AccTrace: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { s } = useSteps();
  return (
    <>
      {TRACE.map(([call, acc], i) => {
        const p = s(i + 2, 0);
        const live = i === TRACE.length - 1 ? p : p * (1 - s(i + 3, 0));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + i * 78,
              fontFamily: F.mono,
              fontWeight: 600,
              fontSize: 36,
              whiteSpace: "pre",
              fontVariantLigatures: "none",
              opacity: Math.min(1, p),
              transform: `translateX(${(1 - p) * -24}px)`,
            }}
          >
            <span style={{ color: C.lav }}>{call}</span>
            <span
              style={{
                display: "inline-block",
                padding: "2px 12px",
                borderRadius: 10,
                border: `3px dashed ${C.amber}`,
                color: C.amber,
                boxShadow: live > 0.05 ? `0 0 ${22 * live}px rgba(242,193,125,0.55)` : undefined,
              }}
            >
              {acc}
            </span>
          </div>
        );
      })}
    </>
  );
};

const S15: React.FC = () => (
  <Slide title="Лінивість і хвостова рекурсія">
    <Lead>
      Хвостова позиція описує <A>форму</A> рекурсивного виклику. Лінивість описує, <A>коли</A> обчислюються аргументи цього виклику.
    </Lead>
    <Code
      x={96}
      y={340}
      size={42}
      step={1}
      code={`
        factorialAcc n = go n 1
          where
            go 0 acc = acc
            go k acc = go (k - 1) [[1@30|(k * acc)]]
      `}
    />
    <At x={1040} y={330} w={800} step={2} size={32} weight={600}>
      <M c={C.amber}>acc</M> може бути відкладеним виразом:
    </At>
    <AccTrace x={1040} y={410} />
    <At x={96} y={790} w={1720} step={6} size={38}>
      Отже: хвостова рекурсія ≠ автоматично строге обчислення акумулятора. Вона задає <A>форму виклику</A>, але не примушує аргументи
      одразу ставати значеннями.
    </At>
  </Slide>
);

export const a5Slides: SlideDef[] = [
  { id: "thunk", title: "Thunk", steps: [40, 55, 60, 80, 60, 55], C: S14 },
  { id: "tail-lazy", title: "Лінивість і хвостова рекурсія", steps: [40, 55, 35, 35, 35, 35, 70], C: S15 },
];

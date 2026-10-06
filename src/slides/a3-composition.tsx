import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Slide } from "../deck/ui";
import { Cell, RowLabel } from "./common";

/* 9 · Композиція функційних перетворень */
const PIPE: { x: number; label: string; kind: "val" | "fn"; color: string }[] = [
  { x: 96, label: "3", kind: "val", color: C.lav },
  { x: 270, label: "square", kind: "fn", color: C.text },
  { x: 566, label: "9", kind: "val", color: C.amber },
  { x: 742, label: "double", kind: "fn", color: C.text },
  { x: 1038, label: "18", kind: "val", color: C.mint },
];
const PIPE_ARROWS = [180, 476, 652, 948];

const S09: React.FC = () => {
  const PY = 760;
  return (
    <Slide title="Композиція функційних перетворень">
      <Lead>
        <A>Композиція</A> створює нову функцію: результат однієї функції стає аргументом іншої.
      </Lead>
      <At x={96} y={316} step={1} size={76} weight={600} font={F.head}>
        (g ∘ f)(x) = g(f(x))
      </At>
      <Code x={96} y={460} size={46} step={2} code={`(.) :: [[2@10|(b -> c)]] -> [[2@18|(a -> b)]] -> a -> c`} />
      <At x={388} y={530} step={2} delay={14} size={34} font={F.mono} color={C.amber}>
        g
      </At>
      <At x={719} y={530} step={2} delay={22} size={34} font={F.mono} color={C.amber}>
        f
      </At>
      <Code x={96} y={620} size={46} step={3} code={`squareThenDouble = double . square`} />
      {PIPE.map((n, i) => (
        <At key={i} x={n.x} y={PY} step={3} delay={14 + i * 12} dir="left" pop>
          {n.kind === "fn" ? (
            <Chip size={40} color={C.text} border={C.accent} bg={C.panel2}>
              {n.label}
            </Chip>
          ) : (
            <Chip size={40} color={n.color} border={n.color}>
              {n.label}
            </Chip>
          )}
        </At>
      ))}
      {PIPE_ARROWS.map((x, i) => (
        <Arrow key={i} x1={x} y1={PY + 36} x2={x + 70} y2={PY + 36} step={3} delay={20 + i * 12} dur={10} color={C.dim} />
      ))}
      <Code x={96} y={880} size={44} step={3} delay={80} code={`squareThenDouble 3    -- 18`} />
    </Slide>
  );
};

/* 10 · Композиція над колекціями */
const X0 = 420;
const P = 88;

const S10: React.FC = () => {
  const { s } = useSteps();
  const xs = [1, 2, 3, 4, 5, 6, 7, 8];
  let j = 0;
  const badge = (n: number, x: number, delay: number) => {
    const p = s(1, delay, POP);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 364,
          width: 50,
          height: 44,
          borderRadius: 8,
          background: n === 1 ? C.pink : "#5e5086",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 28,
          color: C.text,
          opacity: Math.min(1, p),
          transform: `scale(${p})`,
        }}
      >
        {n}
      </div>
    );
  };
  return (
    <Slide title="Композиція над колекціями">
      <Code
        x={96}
        y={220}
        size={46}
        step={0}
        delay={12}
        code={`
          process :: [Int] -> [Int]
          process = [[1@24|map (^2)]] . [[1|filter even]]
        `}
      />
      {badge(1, 789, 4)}
      {badge(2, 444, 28)}
      <Arrow x1={772} y1={386} x2={512} y2={386} step={1} delay={14} dur={14} color={C.amber} />
      <At x={1150} y={222} step={1} size={40}>
        Читання справа наліво:
      </At>
      {[
        <>
          спочатку <M>filter even</M>
        </>,
        <>
          потім <M>map (^2)</M>
        </>,
        <>результатом є нова функція</>,
      ].map((t, i) => (
        <At key={i} x={1170} y={300 + i * 74} w={700} step={1} delay={8 + i * 18} size={36} weight={600}>
          <A c={C.pink}>•</A> {t}
        </At>
      ))}

      <RowLabel x={96} y={560} p={s(2, 0)} color={C.lav}>
        [1..8]
      </RowLabel>
      <RowLabel x={96} y={680} p={s(2, 40)}>
        filter even
      </RowLabel>
      <RowLabel x={96} y={800} p={s(2, 80)}>
        map (^2)
      </RowLabel>
      {xs.map((v, i) => {
        const appear = s(2, 4 + i * 3, POP);
        if (v % 2) {
          return <Cell key={i} x={X0 + i * P} y={560} w={76} label={v} color={C.lav} appear={appear} dim={s(2, 40 + i * 4)} />;
        }
        const k = j++;
        const drop = s(2, 44 + i * 4);
        const sq = s(2, 84 + k * 8);
        return (
          <React.Fragment key={i}>
            <Cell x={X0 + i * P} y={560} w={76} label={v} color={C.lav} appear={appear} />
            <Cell x={X0 + i * P + (k - i) * P * drop} y={560 + 120 * drop} w={76} label={v} color={C.amber} appear={drop} />
            <Cell x={X0 + k * P} y={800} w={76} label={v * v} appear={s(2, 80 + k * 8, POP)} force={sq} glow={sq * (1 - s(2, 100 + k * 8))} />
          </React.Fragment>
        );
      })}
      <Code x={96} y={910} size={42} step={3} code={`process [1..8]    -- [4, 16, 36, 64]`} />
      <At x={1180} y={600} w={660} step={4} size={36}>
        Оператор <M>(.)</M> створює функцію; оператор <M>($)</M> лише <A>застосовує</A> функцію до аргументу.
      </At>
    </Slide>
  );
};

export const a3Slides: SlideDef[] = [
  { id: "composition", title: "Композиція", steps: [40, 55, 55, 140], C: S09 },
  { id: "composition-lists", title: "Композиція над колекціями", steps: [55, 70, 140, 50, 55], C: S10 },
];

import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, M, Slide } from "../deck/ui";

/* 3 · Функційна абстракція: a fixed skeleton with a slot for the behaviour */
const SKELETON: [string, boolean][] = [
  ["applyTwice ", false],
  ["f", true],
  [" x = ", false],
  ["f", true],
  [" (", false],
  ["f", true],
  [" x)", false],
];

const SkeletonLine: React.FC<{ x: number; y: number; size: number; step: number }> = ({ x, y, size, step }) => {
  const { s } = useSteps();
  const base = s(step, 0);
  let slot = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: "pre",
        fontVariantLigatures: "none",
        opacity: base,
        transform: `translateX(${(1 - base) * -24}px)`,
      }}
    >
      {SKELETON.map(([text, hole], i) => {
        if (!hole) {
          return (
            <span key={i} style={{ color: C.lav }}>
              {text}
            </span>
          );
        }
        const p = s(step, 22 + slot++ * 8, POP);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: C.amber,
              borderRadius: 10,
              background: `rgba(242,193,125,${0.22 * Math.min(1, p)})`,
              boxShadow: `0 0 0 ${8 * Math.min(1, p)}px rgba(242,193,125,${0.22 * Math.min(1, p)})`,
              transform: `scale(${0.6 + 0.4 * p})`,
              opacity: Math.min(1, p),
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
};

const S03: React.FC = () => (
  <Slide title="Функційна абстракція">
    <Lead>
      <A>Функційна абстракція</A> відокремлює загальну структуру обчислення від конкретної дії, яка змінюється в окремому випадку.
    </Lead>
    <At x={96} y={350} step={1} dir="left" pop>
      <Chip size={40} color={C.lav} border={C.lav}>
        структура обчислення
      </Chip>
    </At>
    <At x={700} y={350} step={1} delay={12} dir="left" pop>
      <Chip size={40} color={C.amber} border={C.amber}>
        змінна поведінка
      </Chip>
    </At>
    <SkeletonLine x={96} y={490} size={64} step={2} />
    <At x={96} y={650} w={1720} step={3} size={40}>
      У функційному програмуванні змінну частину можна передати <A>як функцію</A>.
    </At>
    <Code
      x={96}
      y={760}
      size={44}
      step={3}
      delay={14}
      stagger={10}
      code={`
        applyTwice (+3) 10       -- 16
        applyTwice tail "abc"    -- "c"
      `}
    />
  </Slide>
);

/* 4 · Функція вищого порядку */
const S04: React.FC = () => (
  <Slide title="Функція вищого порядку">
    <Lead>
      <A>Функція вищого порядку</A> приймає іншу функцію як аргумент, повертає функцію як результат або поєднує обидві можливості.
    </Lead>
    <Code
      x={96}
      y={340}
      size={46}
      step={1}
      code={`
        applyTwice :: [[2|(a -> a)]] -> a -> a
        applyTwice f x = f (f x)

        double :: Int -> Int
        double x = x * 2
      `}
    />
    <At x={1160} y={345} w={700} step={2} size={36} weight={600}>
      <M c={C.amber}>(a -&gt; a)</M> – аргумент сам є функцією
    </At>
    <Code
      x={1160}
      y={470}
      size={44}
      step={3}
      code={`
        @3 applyTwice double 3
        @4 = double (double 3)
        @5 = double 6
        @6 = [[6|12]]
      `}
    />
    <At x={96} y={860} w={1720} step={7} size={40}>
      Параметр <M>f</M> є не даними, а <A>операцією</A>. Загальна схема не залежить від конкретної функції.
    </At>
  </Slide>
);

export const a1Slides: SlideDef[] = [
  { id: "abstraction", title: "Функційна абстракція", steps: [40, 50, 70, 70], C: S03 },
  { id: "hof", title: "Функція вищого порядку", steps: [40, 55, 45, 30, 30, 30, 35, 55], C: S04 },
];

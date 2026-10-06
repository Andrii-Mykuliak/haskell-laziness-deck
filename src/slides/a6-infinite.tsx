import React, { useRef } from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, HaskellLogo, Lead, M, Mark, Slide } from "../deck/ui";
import { Card, Cell, clamp01, Num, RowLabel, useClock } from "./common";

const FADE = (from: number, to: number) => ({
  maskImage: `linear-gradient(90deg, black ${from}px, transparent ${to}px)`,
  WebkitMaskImage: `linear-gradient(90deg, black ${from}px, transparent ${to}px)`,
});

/* 16 · Нескінченні структури */
const S16: React.FC = () => {
  const { s } = useSteps();
  const N = 16;
  const PITCH = 98;
  const Y = 548;
  const bracket = s(3, 6, POP);
  return (
    <Slide title="Нескінченні структури">
      <Lead>
        Лінивий Haskell дозволяє описувати потенційно <A>нескінченні</A> структури, не будуючи їх повністю наперед.
      </Lead>
      <Code
        x={96}
        y={330}
        size={46}
        step={1}
        code={`
          naturals :: [Integer]
          naturals = [1..]
        `}
      />
      <At x={96} y={490} step={2} size={30} weight={600} color={C.lav}>
        продюсер: [1 ..]
      </At>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...FADE(1250, 1780) }}>
        {Array.from({ length: N }, (_, i) => (
          <Cell key={i} x={96 + i * PITCH} y={Y} w={84} label={i + 1} appear={s(2, 4 + i * 3, POP)} force={i < 5 ? s(3, 22 + i * 10) : 0} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          top: Y - 12,
          width: 5 * PITCH + 10,
          height: 88,
          borderRadius: 18,
          border: `4px solid ${C.amber}`,
          boxShadow: "0 0 22px rgba(242,193,125,0.45)",
          opacity: Math.min(1, bracket),
          transform: `scale(${0.9 + 0.1 * bracket})`,
          boxSizing: "border-box",
        }}
      />
      <At x={96} y={634} step={3} delay={10} size={30} weight={600} color={C.amber}>
        споживач: take 5
      </At>
      <Code
        x={96}
        y={706}
        size={46}
        step={3}
        code={`
          take 5 naturals
          @3+80 -- [1, 2, 3, 4, 5]
        `}
      />
      <At x={96} y={900} w={1720} step={4} size={38}>
        <A c={C.lav}>Продюсер</A> задає потенційно нескінченну послідовність, а <A c={C.amber}>споживач</A> формує попит на її скінченний
        фрагмент.
      </At>
    </Slide>
  );
};

/* 17 · repeat, cycle, iterate */
const CYCLE_COL: Record<number, string> = { 1: C.lav, 2: C.amber, 3: C.pink };
const GENS: { code: string; res: string; vals: number[]; take: number; colorOf: (v: number) => string; times?: boolean }[] = [
  { code: "take 6 (repeat 7)", res: "-- [7,7,7,7,7,7]", vals: Array(10).fill(7), take: 6, colorOf: () => C.mint },
  { code: "take 8 (cycle [1,2,3])", res: "-- [1,2,3,1,2,3,1,2]", vals: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1], take: 8, colorOf: (v) => CYCLE_COL[v] },
  { code: "take 6 (iterate (*2) 1)", res: "-- [1,2,4,8,16,32]", vals: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512], take: 6, colorOf: () => C.mint, times: true },
];

const S17: React.FC = () => {
  const { s } = useSteps();
  const X0 = 820;
  const P = 92;
  return (
    <Slide title="repeat, cycle, iterate">
      {GENS.map((g, r) => {
        const step = r + 1;
        const y = 230 + r * 220;
        return (
          <React.Fragment key={r}>
            <Code x={96} y={y} size={44} step={step} code={`${g.code}\n@${step}+${20 + g.take * 7} ${g.res}`} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...FADE(1500, 1800) }}>
              {g.vals.map((v, i) => {
                const taken = i < g.take;
                return (
                  <Cell
                    key={i}
                    x={X0 + i * P}
                    y={y}
                    w={80}
                    label={v}
                    color={g.colorOf(v)}
                    appear={s(step, i * 3, POP)}
                    force={taken ? s(step, 14 + i * 7) : 0}
                    size={v > 99 ? 24 : undefined}
                  />
                );
              })}
            </div>
            {g.times &&
              Array.from({ length: g.take - 1 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: X0 + i * P + 58,
                    top: y - 34,
                    fontFamily: F.mono,
                    fontWeight: 700,
                    fontSize: 22,
                    color: C.amber,
                    opacity: clamp01(s(step, 18 + i * 7)),
                  }}
                >
                  *2
                </div>
              ))}
          </React.Fragment>
        );
      })}
      <At x={96} y={900} w={1720} step={4} size={42}>
        Опис може бути нескінченним; запит до нього – <A>скінченним</A>.
      </At>
    </Slide>
  );
};

/* 18 · Ліниві перетворення колекцій */
const S18: React.FC = () => {
  const { s } = useSteps();
  const X0 = 420;
  const P = 92;
  const T = (i: number) => 10 + i * 12;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 13; i++) {
    const v = i + 1;
    const pulled = i < 10;
    const even = v % 2 === 0;
    cells.push(
      <Cell
        key={`s${i}`}
        x={X0 + i * P}
        y={560}
        w={80}
        label={v}
        color={C.lav}
        appear={s(2, i * 2, POP)}
        force={pulled ? s(2, T(i)) : 0}
        dim={pulled && !even ? s(2, T(i) + 8) : 0}
      />,
    );
    if (pulled && even) {
      cells.push(<Cell key={`f${i}`} x={X0 + i * P} y={680} w={80} label={v} color={C.amber} appear={s(2, T(i) + 4, POP)} />);
      cells.push(
        <Cell
          key={`m${i}`}
          x={X0 + i * P}
          y={800}
          w={80}
          label={v * v}
          appear={s(2, T(i) + 8, POP)}
          glow={s(2, T(i) + 8) * (1 - s(2, T(i) + 24))}
          size={v * v > 99 ? 24 : undefined}
        />,
      );
    }
  }
  const k = [1, 3, 5, 7, 9].filter((i) => s(2, T(i) + 8) > 0.5).length;
  return (
    <Slide title="Ліниві перетворення колекцій">
      <Code
        x={96}
        y={200}
        size={42}
        step={0}
        delay={12}
        code={`
          evenSquares :: [Integer]
          evenSquares = map (^2) (filter even [1..])

          @1 take 5 evenSquares
          @2+150 -- [4, 16, 36, 64, 100]
        `}
      />
      <RowLabel x={96} y={560} p={s(2, 0)} color={C.lav}>
        [1 ..]
      </RowLabel>
      <RowLabel x={96} y={680} p={s(2, 0)}>
        filter even
      </RowLabel>
      <RowLabel x={96} y={800} p={s(2, 0)}>
        map (^2)
      </RowLabel>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...FADE(1420, 1640) }}>{cells}</div>
      <At x={1560} y={800} step={2} delay={6} pop>
        <Chip size={30} color={k === 5 ? C.amber : C.mint} border={k === 5 ? C.amber : C.mint}>
          {k === 5 ? "5 / 5 досить" : `${k} / 5`}
        </Chip>
      </At>
      <At x={96} y={910} w={1720} step={3} size={36}>
        <M>map</M> і <M>filter</M> застосовані до нескінченного списку, але <M>take 5</M> вимагає лише <A>п’ять результатів</A>.
      </At>
    </Slide>
  );
};

/* 19 · Самопосилальна лінива структура */
const FIBS = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];

const S19: React.FC = () => {
  const { s, lin } = useSteps();
  const X0 = 420;
  const P = 92;
  const Y = { fibs: 570, tail: 680, sum: 790 };
  const S = (j: number) => 26 + j * 20;
  const fibForce = (i: number) => (i === 0 ? s(2, 4) : i === 1 ? s(2, 8) : s(2, S(i - 2) + 8));
  const cx = (i: number) => X0 + i * P + 40;
  return (
    <Slide title="Самопосилальна лінива структура">
      <Code
        x={96}
        y={200}
        size={42}
        step={0}
        delay={12}
        code={`
          fibs :: [Integer]
          fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

          @1 take 10 fibs
          @2+190 -- [0,1,1,2,3,5,8,13,21,34]
        `}
      />
      <RowLabel x={96} y={Y.fibs} p={s(2, 0)} color={C.lav}>
        fibs
      </RowLabel>
      <RowLabel x={96} y={Y.tail} p={s(2, 0)}>
        tail fibs
      </RowLabel>
      <RowLabel x={96} y={Y.sum} p={s(2, 0)} color={C.amber}>
        zipWith (+)
      </RowLabel>
      {FIBS.map((v, i) => (
        <Cell
          key={`f${i}`}
          x={X0 + i * P}
          y={Y.fibs}
          w={80}
          label={v}
          color={C.lav}
          appear={s(2, i * 2, POP)}
          force={fibForce(i)}
          glow={i > 1 ? fibForce(i) * (1 - s(2, S(i - 2) + 26)) : 0}
        />
      ))}
      {FIBS.slice(1).map((v, j) => (
        <Cell key={`t${j}`} x={X0 + j * P} y={Y.tail} w={80} label={v} color={C.lav} appear={s(2, 2 + j * 2, POP)} force={j === 0 ? s(2, 14) : fibForce(j + 1)} />
      ))}
      {FIBS.slice(2).map((v, j) => {
        const p = s(2, S(j), POP);
        return <Cell key={`z${j}`} x={X0 + j * P} y={Y.sum} w={80} label={v} color={C.amber} appear={p} glow={clamp01(p) * (1 - s(2, S(j) + 16))} />;
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {FIBS.slice(2).map((_, j) => {
          const o = lin(2, S(j) + 2, 6) * (1 - lin(2, S(j) + 16, 10));
          if (o < 0.01) return null;
          const x1 = cx(j) + 20;
          const x2 = cx(j + 2);
          return (
            <path
              key={j}
              d={`M ${x1} ${Y.sum} C ${x1 + 120} ${Y.sum - 60}, ${x2 + 70} ${Y.fibs + 140}, ${x2 + 8} ${Y.fibs + 68}`}
              stroke={C.amber}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              opacity={o}
            />
          );
        })}
      </svg>
      <At x={96} y={910} w={1720} step={3} size={36}>
        Список не потрібно побудувати повністю до початку використання: нові елементи виникають <A>у міру потреби</A>.
      </At>
    </Slide>
  );
};

/* 20 · Завершуваність і продуктивність */
const useSince = (active: boolean) => {
  const sec = useClock();
  const start = useRef<number | null>(null);
  if (active && start.current === null) start.current = sec;
  if (!active) start.current = null;
  return start.current === null ? 0 : sec - start.current;
};

const fmt = (n: number) => n.toLocaleString("uk-UA");

const S20: React.FC = () => {
  const { s, lin } = useSteps();
  const left = s(1, 0, POP);
  const run = useSince(left > 0.5);
  const n = Math.floor(run * 24);
  const sum = (n * (n + 1)) / 2;
  const spin = run * 360;
  const fill = lin(2, 24, 60);
  const k = Math.round(fill * 100);
  const head = (num: number, t: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Num n={num} />
      <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 42 }}>{t}</div>
    </div>
  );
  const q = (t: string) => <div style={{ marginTop: 26, fontFamily: F.body, fontSize: 31, lineHeight: 1.4 }}>{t}</div>;
  return (
    <Slide title="Завершуваність і продуктивність">
      <Card x={96} y={210} w={840} h={620} p={left}>
        {head(1, "Завершуваність")}
        {q("Чи завершується все обчислення як скінченний процес?")}
        <div style={{ position: "absolute", left: 40, top: 290 }}>
          <Chip size={40}>sum [1..]</Chip>
        </div>
        <svg width={64} height={64} style={{ position: "absolute", left: 340, top: 296, transform: `rotate(${spin}deg)`, opacity: clamp01(s(1, 10)) }}>
          <circle cx={32} cy={32} r={24} stroke={C.line} strokeWidth={6} fill="none" />
          <path d="M 32 8 A 24 24 0 0 1 56 32" stroke={C.amber} strokeWidth={6} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 40, top: 410, fontFamily: F.mono, fontWeight: 600, fontSize: 30, color: C.dim, opacity: clamp01(s(1, 10)), whiteSpace: "pre" }}>
          {`1 + 2 + … + ${fmt(n)}`}
        </div>
        <div style={{ position: "absolute", left: 40, top: 456, fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.amber, opacity: clamp01(s(1, 10)) }}>
          {`= ${fmt(sum)} …`}
        </div>
        <Mark ok={false} step={1} delay={40} x={40} y={536} size={48} />
        <div style={{ position: "absolute", left: 110, top: 542, fontFamily: F.body, fontSize: 30, opacity: clamp01(s(1, 46)) }}>
          <M>sum [1..]</M> не завершується.
        </div>
      </Card>
      <Card x={984} y={210} w={840} h={620} p={s(2, 0, POP)}>
        {head(2, "Продуктивність")}
        {q("Чи можна за скінченний час отримати потрібний скінченний префікс?")}
        <div style={{ position: "absolute", left: 40, top: 290 }}>
          <Chip size={40}>take 100 [1..]</Chip>
        </div>
        <div style={{ position: "absolute", left: 40, top: 420, width: 640, height: 26, borderRadius: 13, background: C.panel2, opacity: clamp01(s(2, 14)) }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 13, background: `linear-gradient(90deg, ${C.blue}, ${C.mint})` }} />
        </div>
        <div style={{ position: "absolute", left: 700, top: 408, fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: k === 100 ? C.mint : C.dim, opacity: clamp01(s(2, 14)) }}>
          {k}
        </div>
        <Mark ok step={2} delay={88} x={40} y={536} size={48} />
        <div style={{ position: "absolute", left: 110, top: 542, fontFamily: F.body, fontSize: 30, opacity: clamp01(s(2, 92)) }}>
          <M>take 100 [1..]</M> завершується.
        </div>
      </Card>
      <At x={96} y={890} w={1720} step={3} size={40}>
        Лінивість <A>не робить</A> нескінченне обчислення скінченним автоматично.
      </At>
    </Slide>
  );
};

/* 21 · Підсумок */
const POINTS = [
  "функційна абстракція відокремлює схему обчислення від конкретної дії",
  "map, filter і zipWith приховують рекурсивний обхід структури",
  "композиція створює нові функції з простіших перетворень",
  "лінива модель Haskell відповідає обчисленню за потребою",
  "thunk відкладає роботу і дозволяє повторно використати результат",
  "нескінченні структури корисні, якщо потрібний лише скінченний префікс",
];

const S21: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <div style={{ position: "absolute", right: 90, top: 90, opacity: 0.25 * s(0, 10) }}>
        <HaskellLogo size={420} p1={s(0, 4, POP)} p2={s(0, 10, POP)} p3={s(0, 16, POP)} />
      </div>
      <At x={130} y={180} step={0} delay={4} size={80} weight={800} font={F.head}>
        Підсумок
      </At>
      {POINTS.map((p, i) => (
        <At key={i} x={190} y={340 + i * 92} w={1560} step={0} delay={18 + i * 9} size={40} weight={600}>
          <A c={C.pink}>•</A> {p}
        </At>
      ))}
    </Slide>
  );
};

export const a6Slides: SlideDef[] = [
  { id: "infinite", title: "Нескінченні структури", steps: [40, 50, 70, 100, 60], C: S16 },
  { id: "generators", title: "repeat, cycle, iterate", steps: [30, 80, 90, 80, 55], C: S17 },
  { id: "lazy-pipeline", title: "Ліниві перетворення", steps: [55, 40, 175, 55], C: S18 },
  { id: "fibs", title: "Самопосилальна структура", steps: [55, 40, 200, 55], C: S19 },
  { id: "productivity", title: "Завершуваність і продуктивність", steps: [30, 70, 110, 55], C: S20 },
];
export const summarySlide: SlideDef = { id: "summary", title: "Підсумок", steps: [100], C: S21 };

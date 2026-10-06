import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Slide } from "../deck/ui";
import { Card, Cell, Num } from "./common";

/* 11 · Стратегії обчислення */
const Head: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <Num n={n} />
    <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 42, color: C.text }}>{children}</div>
  </div>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: 26, fontFamily: F.body, fontSize: 31, lineHeight: 1.4, color: C.text }}>{children}</div>
);

const Caption: React.FC<{ y: number; p: number; children: React.ReactNode }> = ({ y, p, children }) => (
  <div style={{ position: "absolute", left: 40, top: y, fontFamily: F.body, fontSize: 26, color: C.dim, opacity: Math.min(1, p) }}>
    {children}
  </div>
);

const FnBox: React.FC<{ x: number; y: number; p: number; children: React.ReactNode }> = ({ x, y, p, children }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, p), transform: `scale(${0.7 + 0.3 * p})` }}>
    <Chip size={34} color={C.text} border={C.accent} bg={C.panel2}>
      {children}
    </Chip>
  </div>
);

const S11: React.FC = () => {
  const { s } = useSteps();
  const TY = 330;
  return (
    <Slide title="Стратегії обчислення">
      <Lead>
        Для виразу <M>f e</M> важливо не лише, що обчислюється, а й <A>коли</A> обчислюється аргумент <M>e</M>.
      </Lead>
      <Card x={96} y={330} w={840} h={520} p={s(1, 0, POP)}>
        <Head n={1}>Обчислення за значенням</Head>
        <Body>Аргумент обчислюється до виклику функції. Функція отримує вже готове значення. Це типовий підхід для строгих мов.</Body>
        <Cell x={40} y={TY} w={120} label="v" thunkLabel="e" color={C.mint} appear={s(1, 14, POP)} force={s(1, 34)} />
        <Arrow x1={180} y1={TY + 32} x2={250} y2={TY + 32} step={1} delay={44} dur={10} color={C.dim} />
        <FnBox x={270} y={TY - 4} p={s(1, 52, POP)}>
          f v
        </FnBox>
        <Caption y={TY + 100} p={s(1, 62)}>
          спочатку обчислюється e, потім викликається f
        </Caption>
      </Card>
      <Card x={984} y={330} w={840} h={520} p={s(2, 0, POP)}>
        <Head n={2}>Обчислення за потребою</Head>
        <Body>Аргумент відкладається до моменту потреби. Після обчислення результат зберігається і використовується повторно.</Body>
        <FnBox x={40} y={TY - 4} p={s(2, 14, POP)}>
          f
        </FnBox>
        <Cell x={130} y={TY} w={100} label="e" thunkLabel="e" appear={s(2, 20, POP)} force={0} />
        <Arrow x1={250} y1={TY + 32} x2={330} y2={TY + 32} step={2} delay={44} dur={10} color={C.amber} />
        <Cell x={350} y={TY} w={100} label="v" thunkLabel="e" appear={s(2, 50, POP)} force={s(2, 56)} glow={s(2, 56) * (1 - s(2, 76))} />
        <div style={{ position: "absolute", left: 480, top: TY + 8, opacity: Math.min(1, s(2, 74, POP)), transform: `scale(${s(2, 74, POP)})` }}>
          <Chip size={26} color={C.amber} border={C.amber}>
            збережено
          </Chip>
        </div>
        <Caption y={TY + 100} p={s(2, 84)}>
          e обчислюється лише тоді, коли знадобилося, і один раз
        </Caption>
      </Card>
    </Slide>
  );
};

/* 12 · Нестрогість на прикладах */
const S12: React.FC = () => (
  <Slide title="Нестрогість на прикладах">
    <Lead>
      Haskell може отримати результат, не обчислюючи <A>непотрібні</A> частини виразу.
    </Lead>
    <Code
      x={96}
      y={330}
      size={46}
      step={1}
      code={`
        first :: a -> b -> a
        first x _ = x

        first 10 [[.1@40|(1 \`div\` 0)]]
        @1+60 -- 10
      `}
    />
    <At x={710} y={538} step={1} delay={44} size={30} weight={400} color={C.dim}>
      ← не обчислюється
    </At>
    <Code
      x={1100}
      y={330}
      size={46}
      step={2}
      code={`
        if True
        then 42
        else [[.2@40|1 \`div\` 0]]
        @2+60 -- 42
      `}
    />
    <At x={1100} y={620} step={2} delay={44} size={30} weight={400} color={C.dim}>
      гілка else не обчислюється
    </At>
    <At x={96} y={820} w={1720} step={3} size={40}>
      Обчислюється лише та частина, значення якої <A>потрібне</A> для результату.
    </At>
  </Slide>
);

/* 13 · WHNF */
const S13: React.FC = () => {
  const { s } = useSteps();
  const X = 1060;
  const Y = 440;
  const p = s(2, 0, POP);
  const box = (left: number, w: number, label: string, color: string, dashed = false) => (
    <div
      style={{
        position: "absolute",
        left,
        top: Y,
        width: w,
        height: 84,
        border: `3px ${dashed ? "dashed" : "solid"} ${color}`,
        background: dashed ? "transparent" : C.panel,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 36,
        boxSizing: "border-box",
        borderRadius: dashed ? 14 : 0,
      }}
    >
      {label}
    </div>
  );
  return (
    <Slide title="WHNF: слабка головна нормальна форма">
      <Lead>
        Вираз перебуває у <A>WHNF</A>, коли вже відома його зовнішня форма, але внутрішні складові можуть залишатися необчисленими.
      </Lead>
      <Code
        x={96}
        y={380}
        size={52}
        step={1}
        code={`
          head (1 : undefined)
          @1+30 -- 1
        `}
      />
      <At x={X} y={360} step={2} size={30} weight={600} color={C.amber}>
        (:) – зовнішня форма відома
      </At>
      <div style={{ opacity: Math.min(1, p), transform: `scale(${p})`, transformOrigin: `${X + 90}px ${Y + 42}px` }}>
        {box(X, 110, "1", C.mint)}
        {box(X + 110, 70, "•", C.accent)}
      </div>
      <Arrow x1={X + 160} y1={Y + 42} x2={X + 260} y2={Y + 42} step={2} delay={16} dur={12} color={C.accent} />
      <div style={{ opacity: Math.min(1, s(2, 24, POP)) }}>{box(X + 280, 300, "undefined", C.faint, true)}</div>
      <At x={X} y={Y + 104} step={2} delay={30} size={28} weight={400} color={C.dim}>
        голова
      </At>
      <At x={X + 280} y={Y + 104} step={2} delay={36} size={28} weight={400} color={C.dim}>
        хвіст не обчислюється
      </At>
      <At x={96} y={660} w={1720} step={2} delay={50} size={38}>
        Для списку достатньо визначити, чи це <M>[]</M> або <M>x:xs</M>. Хвіст <M>xs</M> може не обчислюватися.
      </At>
      <At x={96} y={840} w={1720} step={3} size={40}>
        <A>WHNF</A> не означає повного обчислення всіх складових значення.
      </At>
    </Slide>
  );
};

export const a4Slides: SlideDef[] = [
  { id: "strategies", title: "Стратегії обчислення", steps: [40, 90, 110], C: S11 },
  { id: "non-strict", title: "Нестрогість", steps: [40, 80, 80, 55], C: S12 },
  { id: "whnf", title: "WHNF", steps: [40, 55, 100, 55], C: S13 },
];

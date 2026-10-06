import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";

const TitleSlide: React.FC = () => {
  const { s, t } = useSteps();
  const lines = ["Функційні", "абстракції та", "ліниві обчислення"];
  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 1.4);
      return (
        <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px)`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    });
  const glow = interpolate(t(0, 40), [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Slide>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 14,
          width: 760,
          height: 540,
          background: "#141821",
          opacity: s(0, 0),
        }}
      />
      <div style={{ position: "absolute", right: 60, top: 70, filter: `drop-shadow(0 0 ${40 * glow}px rgba(143,78,139,0.35))` }}>
        <HaskellLogo size={680} p1={s(0, 4, POP)} p2={s(0, 12, POP)} p3={s(0, 22, POP)} />
      </div>
      <At x={116} y={190} step={0} delay={8} size={60} weight={800} color={C.pink}>
        Лекція 6
      </At>
      <div style={{ position: "absolute", left: 110, top: 300, fontFamily: F.head, fontWeight: 800, fontSize: 100, lineHeight: 1.12, color: C.text }}>
        {lines.map((l, i) => (
          <div key={i}>{letters(l, 14 + i * 14)}</div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 670,
          height: 6,
          width: mix(0, 520, s(0, 56)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={116} y={710} step={0} delay={62} size={36} weight={400} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"evenSquares = map (^2) (filter even [1..])"}
      </At>
    </Slide>
  );
};

/* Epigraph: Hughes's own example. A generator and a selector are separate modules; laziness glues them,
   the selector demands values one at a time and the generator stops when the selector is satisfied. */
const APPROX = (() => {
  const out = [1];
  for (let i = 0; i < 4; i++) out.push((out[i] + 2 / out[i]) / 2);
  return out;
})();
const SHOWN = ["1", "1.5", "1.4166667", "1.4142157", "1.4142136"];
const DIFFS = ["", "0.5", "0.0833333", "0.0024510", "0.0000021"];
const DEMAND_AT = (k: number) => 30 + k * 36;
const PULSE = 12;
const TRAVEL = 18;
const ARRIVE = (k: number) => DEMAND_AT(k) + PULSE + TRAVEL;
const STOP_AT = ARRIVE(APPROX.length - 1) + 4;

const BOX = { y: 430, h: 236, w: 560 };
const GEN_X = 112;
const SEL_X = 1920 - 112 - BOX.w;
const PIPE = { x0: GEN_X + BOX.w + 20, x1: SEL_X - 20, y: BOX.y + BOX.h / 2 };

const ModuleBox: React.FC<{ x: number; p: number; color: string; glow?: number; children: React.ReactNode }> = ({ x, p, color, glow = 0, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: BOX.y,
      width: BOX.w,
      height: BOX.h,
      borderRadius: 18,
      background: C.panel,
      border: `3px solid ${color}`,
      boxSizing: "border-box",
      padding: "26px 32px",
      opacity: Math.min(1, p),
      transform: `translateY(${(1 - p) * 24}px)`,
      boxShadow: glow > 0.02 ? `0 0 ${34 * glow}px ${color}` : undefined,
    }}
  >
    {children}
  </div>
);

const ModuleLabel: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 30, color, letterSpacing: 1 }}>{children}</div>
);

const ModuleCode: React.FC<{ size?: number; color?: string; children: React.ReactNode }> = ({ size = 40, color = C.mint, children }) => (
  <div style={{ marginTop: 14, fontFamily: F.mono, fontWeight: 700, fontSize: size, color, whiteSpace: "pre", fontVariantLigatures: "none" }}>
    {children}
  </div>
);

const GeneratorSelector: React.FC = () => {
  const { s, lin, t } = useSteps();
  const f = t(0);
  const done = f >= STOP_AT;
  const arrived = APPROX.map((_, k) => f >= ARRIVE(k)).lastIndexOf(true);
  const genGlow = APPROX.reduce((g, _, k) => Math.max(g, lin(0, DEMAND_AT(k) + PULSE - 2, 4) * (1 - lin(0, DEMAND_AT(k) + PULSE + 6, 8))), 0);
  const selGlow = done ? s(0, STOP_AT) * (1 - 0.6 * s(0, STOP_AT + 20)) : 0;
  const pipe = s(0, 14);
  const tokenW = (k: number) => SHOWN[k].length * 18 + 36;
  const status = done ? `≤ 0.001  →  ${SHOWN[4]}` : arrived < 0 ? "чекає значень" : arrived === 0 ? `a = ${SHOWN[0]}` : `|a - b| = ${DIFFS[arrived]}`;
  return (
    <>
      <ModuleBox x={GEN_X} p={s(0, 2, POP)} color={done ? C.line : C.lav} glow={genGlow}>
        <ModuleLabel color={C.lav}>генератор</ModuleLabel>
        <ModuleCode>{"iterate (next 2) 1"}</ModuleCode>
        <ModuleCode size={26} color={C.dim}>
          {"next n x = (x + n / x) / 2"}
        </ModuleCode>
      </ModuleBox>
      <ModuleBox x={SEL_X} p={s(0, 8, POP)} color={done ? C.mint : C.amber} glow={selGlow}>
        <ModuleLabel color={done ? C.mint : C.amber}>селектор</ModuleLabel>
        <ModuleCode>{"within 0.001"}</ModuleCode>
        <ModuleCode size={30} color={done ? C.mint : C.amber}>
          {status}
        </ModuleCode>
      </ModuleBox>

      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={PIPE.x0} y1={PIPE.y - 34} x2={PIPE.x0 + (PIPE.x1 - PIPE.x0) * pipe} y2={PIPE.y - 34} stroke={C.line} strokeWidth={3} />
        <line x1={PIPE.x0} y1={PIPE.y + 34} x2={PIPE.x0 + (PIPE.x1 - PIPE.x0) * pipe} y2={PIPE.y + 34} stroke={C.line} strokeWidth={3} />
        {APPROX.map((_, k) => {
          const p = lin(0, DEMAND_AT(k), PULSE);
          if (p <= 0 || p >= 1) return null;
          const x = PIPE.x1 - (PIPE.x1 - PIPE.x0) * p;
          return <circle key={k} cx={x} cy={PIPE.y} r={12} fill={C.amber} style={{ filter: "drop-shadow(0 0 8px rgba(242,193,125,0.9))" }} />;
        })}
      </svg>

      {APPROX.map((_, k) => {
        const p = lin(0, DEMAND_AT(k) + PULSE, TRAVEL);
        if (p <= 0) return null;
        const w = tokenW(k);
        const eased = 1 - Math.pow(1 - p, 3);
        const x = PIPE.x0 + 8 + (PIPE.x1 - PIPE.x0 - w - 16) * eased;
        const fade = 1 - lin(0, ARRIVE(k) + 2, 8);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              top: PIPE.y - 26,
              width: w,
              height: 52,
              borderRadius: 26,
              border: `3px solid ${C.mint}`,
              background: "rgba(134,224,168,0.16)",
              color: C.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 30,
              boxSizing: "border-box",
              opacity: Math.min(1, p * 4) * fade,
            }}
          >
            {SHOWN[k]}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: PIPE.x0 + 8,
          top: PIPE.y - 26,
          width: 90,
          height: 52,
          borderRadius: 26,
          border: `3px dashed ${C.faint}`,
          color: C.faint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          boxSizing: "border-box",
          opacity: s(0, STOP_AT + 10),
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          left: PIPE.x0,
          width: PIPE.x1 - PIPE.x0,
          top: PIPE.y - 84,
          textAlign: "center",
          fontFamily: F.body,
          fontSize: 27,
          color: done ? C.text : C.dim,
          opacity: pipe,
        }}
      >
        {done ? "решта послідовності не обчислюється" : "лінивий потік: значення лише на запит"}
      </div>
      <div
        style={{
          position: "absolute",
          left: PIPE.x0,
          width: PIPE.x1 - PIPE.x0,
          top: PIPE.y + 48,
          textAlign: "center",
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 24,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: s(0, 20),
        }}
      >
        <span style={{ color: C.amber }}>within 0.001</span>
        <span style={{ color: C.dim }}>{" ("}</span>
        <span style={{ color: C.lav }}>iterate (next 2) 1</span>
        <span style={{ color: C.dim }}>)</span>
      </div>
    </>
  );
};

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 5, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  return (
    <Slide>
        <GeneratorSelector />
        <div style={{ position: "absolute", left: 110, top: 110, width: 1700, fontFamily: F.head, fontWeight: 800, fontSize: 66, lineHeight: 1.22, color: C.text }}>
          <div>
            {words("Lazy evaluation", 8, C.accentHi)}
            {words("is perhaps the most powerful", 18)}
          </div>
          <div>{words("tool for modularization in the functional", 44)}</div>
          <div>{words("programmer’s repertoire.", 74)}</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 116,
            top: 720,
            height: 6,
            width: mix(0, 420, s(1, 0)),
            background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
            borderRadius: 3,
          }}
        />
        <At x={110} y={750} w={1700} step={1} delay={6} size={44} weight={600} color={C.text}>
          Ліниві обчислення – мабуть, найпотужніший інструмент модуляризації в арсеналі функційного програміста.
        </At>
        <At x={110} y={900} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
          John Hughes
        </At>
        <At x={110} y={950} w={1600} step={1} delay={36} size={30} weight={400} color={C.dim}>
          «Why Functional Programming Matters», 1989
        </At>
    </Slide>
  );
};

const AGENDA = [
  "Функційна абстракція та функції вищого порядку",
  "Типові функційні перетворення колекцій",
  "Композиція функційних перетворень",
  "Нестрогість і лінива модель обчислень",
  "Відкладені обчислення та спільне використання результатів",
  "Нескінченні структури й обчислення за потребою",
];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  const Y0 = 220;
  const GAP = 118;
  return (
    <Slide title="План">
      {!full && (
        <div
          style={{
            position: "absolute",
            left: 84,
            top: Y0 + active! * GAP - 14,
            width: mix(0, 1740, s(0, 6)),
            height: 92,
            borderRadius: 14,
            background: "rgba(141,118,220,0.13)",
            border: `2px solid rgba(141,118,220,${0.5 * s(0, 6)})`,
          }}
        />
      )}
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const y = Y0 + i * GAP;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 104,
              top: y,
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: p * dim,
              transform: `translateX(${(1 - p) * -40 + on * 24}px)`,
            }}
          >
            <div
              style={{
                width: 76,
                height: 64,
                borderRadius: 8,
                background: i % 2 ? "#5e5086" : C.pink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 40,
                color: C.text,
                boxShadow: on ? `0 0 ${30 * on}px rgba(178,95,168,${0.6 * on})` : undefined,
                transform: `scale(${1 + 0.12 * on})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 54, fontWeight: on ? 700 : 400, color: C.text }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [100], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [STOP_AT + 50, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});

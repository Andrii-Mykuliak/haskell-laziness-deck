import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";

const TitleSlide: React.FC = () => {
  const { s } = useSteps();
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
  return (
    <Slide>
      <div style={{ position: "absolute", right: 60, top: 70 }}>
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
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: an infinite row of lanterns running to the horizon is the list map (^2) [1..];
   take 5 lights only the first five, the rest stay dark all the way to the horizon. */
const VP = { x: 300, y: 470 };
const FRONT = { x: 1690, y: 690 };
const LANTERNS = 40;
const depth = (i: number) => 1 / (1 + 0.42 * i);
const lanternAt = (i: number) => {
  const k = depth(i);
  return { x: VP.x + (FRONT.x - VP.x) * k, y: VP.y + (FRONT.y - VP.y) * k, sc: k };
};
const TAKEN = 5;
const LIGHT_AT = (i: number) => 100 + i * 28;
const STOP_AT = LIGHT_AT(TAKEN - 1) + 60;

const Lanterns: React.FC = () => {
  const { s, lin } = useSteps();
  const road = lin(0, 10, 40);
  const far = lanternAt(LANTERNS - 1);
  const result = s(0, LIGHT_AT(TAKEN - 1) + 26);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <radialGradient id="lampGlow">
            <stop offset="0" stopColor="#ffe3a6" stopOpacity="0.9" />
            <stop offset="0.35" stopColor={C.amber} stopOpacity="0.35" />
            <stop offset="1" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="poolGlow">
            <stop offset="0" stopColor={C.amber} stopOpacity="0.35" />
            <stop offset="1" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="horizon" x1="0" x2="1">
            <stop offset="0" stopColor={C.line} stopOpacity="0" />
            <stop offset="0.25" stopColor={C.line} stopOpacity="0.8" />
            <stop offset="1" stopColor={C.line} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={120} y1={VP.y} x2={120 + 1700 * road} y2={VP.y} stroke="url(#horizon)" strokeWidth={2} />
        <line x1={FRONT.x + 40} y1={FRONT.y + 18} x2={FRONT.x + 40 + (VP.x - FRONT.x - 40) * road} y2={FRONT.y + 18 + (VP.y - FRONT.y - 18) * road} stroke={C.line} strokeWidth={2} />
        <line x1={FRONT.x - 120} y1={FRONT.y + 30} x2={FRONT.x - 120 + (VP.x - FRONT.x + 120) * road} y2={FRONT.y + 30 + (VP.y - FRONT.y - 30) * road} stroke={C.line} strokeWidth={1.5} strokeDasharray="10 12" opacity={0.7} />
        {Array.from({ length: LANTERNS }, (_, j) => LANTERNS - 1 - j).map((i) => {
          const { x, y, sc } = lanternAt(i);
          const appear = s(0, 20 + i * 1.8);
          const lit = i < TAKEN ? s(0, LIGHT_AT(i)) : 0;
          const ph = 190 * sc;
          const lw = 26 * sc;
          const lh = 34 * sc;
          const top = y - ph;
          return (
            <g key={i} opacity={Math.min(1, appear) * (i < TAKEN ? 1 : 0.55 + 0.45 * sc)}>
              {lit > 0 && <ellipse cx={x} cy={y + 4 * sc} rx={90 * sc} ry={16 * sc} fill="url(#poolGlow)" opacity={lit} />}
              {lit > 0 && <circle cx={x} cy={top - lh / 2} r={95 * sc} fill="url(#lampGlow)" opacity={lit} />}
              <line x1={x} y1={y} x2={x} y2={top} stroke={lit > 0.5 ? "#8a7a62" : C.faint} strokeWidth={Math.max(1, 4 * sc)} strokeLinecap="round" />
              <path
                d={`M ${x - lw / 2} ${top} L ${x - lw * 0.38} ${top - lh} L ${x + lw * 0.38} ${top - lh} L ${x + lw / 2} ${top} Z`}
                fill={lit > 0 ? `rgba(255,214,140,${0.85 * lit})` : C.bg}
                stroke={lit > 0.5 ? C.amber : C.faint}
                strokeWidth={Math.max(1, 2.4 * sc)}
                strokeLinejoin="round"
              />
              <path d={`M ${x - lw * 0.5} ${top - lh} L ${x} ${top - lh - 12 * sc} L ${x + lw * 0.5} ${top - lh} Z`} fill={lit > 0.5 ? "#8a7a62" : C.faint} />
              {i < TAKEN && (
                <text
                  x={x}
                  y={top - lh - 22 * sc}
                  textAnchor="middle"
                  fontFamily={F.mono}
                  fontWeight={700}
                  fontSize={Math.max(13, 38 * sc)}
                  fill={C.amber}
                  opacity={lit}
                >
                  {(i + 1) * (i + 1)}
                </text>
              )}
            </g>
          );
        })}
        <circle cx={far.x - 30} cy={far.y - 4} r={2} fill={C.faint} opacity={road} />
      </svg>
      <At x={110} y={592} step={0} delay={30} size={34} weight={600} color={C.text} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        <span style={{ color: C.amber }}>take 5</span> <span style={{ color: C.dim }}>(</span>
        <span style={{ color: C.lav }}>map (^2) [1..]</span>
        <span style={{ color: C.dim }}>)</span>
      </At>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 642,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          color: C.mint,
          whiteSpace: "pre",
          opacity: result,
          transform: `translateY(${(1 - result) * 12}px)`,
        }}
      >
        {"= [1, 4, 9, 16, 25]"}
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
        <Lanterns />
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
  const Y0 = 206;
  const GAP = 118;
  const hl = full ? 0 : s(0, 6);
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const isActive = !full && i === active;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 84,
              top: Y0 + i * GAP,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "12px 34px 12px 20px",
              opacity: p * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  background: "rgba(141,118,220,0.13)",
                  border: `2px solid rgba(141,118,220,${0.5 * hl})`,
                  clipPath: `inset(0 ${(1 - hl) * 100}% 0 0 round 14px)`,
                }}
              />
            )}
            <div
              style={{
                position: "relative",
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
                flexShrink: 0,
                boxShadow: on ? `0 0 ${30 * on}px rgba(178,95,168,${0.6 * on})` : undefined,
                transform: `scale(${1 + 0.12 * on})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ position: "relative", fontFamily: F.body, fontSize: 48, fontWeight: on ? 700 : 400, color: C.text, whiteSpace: "nowrap" }}>
              {item}
            </div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [STOP_AT + 50, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});

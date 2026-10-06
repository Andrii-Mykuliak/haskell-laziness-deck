import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";
import { useClock } from "./common";

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

/* Epigraph: a tape of thunks that a consumer forces one cell at a time, forever. */
const TAPE_STEP = 0.42;
const CELL = 88;
const CELL_GAP = 12;
const PITCH = CELL + CELL_GAP;
const TAPE_X0 = 112;
const TAPE_STOP = 1420;

const DemandTape: React.FC<{ sec: number; p: number }> = ({ sec, p }) => {
  const pos = sec / TAPE_STEP;
  const idx = Math.floor(pos);
  const frac = pos - idx;
  const eased = frac < 0.5 ? 2 * frac * frac : 1 - Math.pow(-2 * frac + 2, 2) / 2;
  const headW = (idx + eased) * PITCH;
  const cam = Math.max(0, headW - (TAPE_STOP - TAPE_X0));
  const first = Math.max(0, Math.floor(cam / PITCH) - 1);
  const last = first + Math.ceil(1920 / PITCH) + 3;
  const cells: React.ReactNode[] = [];
  for (let i = first; i <= last; i++) {
    const forced = i < idx || (i === idx && frac > 0.55);
    cells.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: TAPE_X0 + i * PITCH - cam,
          top: 10,
          width: CELL,
          height: 64,
          borderRadius: 14,
          border: `3px ${forced ? "solid" : "dashed"} ${forced ? C.mint : C.faint}`,
          background: forced ? "rgba(134,224,168,0.18)" : "transparent",
          color: forced ? C.mint : C.faint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 24,
          boxSizing: "border-box",
        }}
      >
        {forced ? (i + 1) * (i + 1) : "?"}
      </div>,
    );
  }
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: TAPE_X0,
          top: 92,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 32,
          color: C.dim,
          whiteSpace: "pre",
          fontVariantLigatures: "none",
          opacity: Math.min(1, p),
        }}
      >
        {"take n (map (^2) [1 ..])    "}
        <span style={{ color: C.amber }}>{`n = ${idx + 1}`}</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 140,
          width: 1920,
          height: 84,
          opacity: Math.min(1, p),
          maskImage: "linear-gradient(90deg, transparent 0px, transparent 70px, black 230px, black 1600px, transparent 1900px)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0px, transparent 70px, black 230px, black 1600px, transparent 1900px)",
        }}
      >
        {cells}
        <div
          style={{
            position: "absolute",
            left: TAPE_X0 + headW - cam - 7,
            top: 3,
            width: CELL + 14,
            height: 78,
            borderRadius: 18,
            border: `4px solid ${C.amber}`,
            boxShadow: "0 0 22px rgba(242,193,125,0.6)",
            boxSizing: "border-box",
          }}
        />
      </div>
    </>
  );
};

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const sec = useClock();
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
        <DemandTape sec={sec} p={s(0, 0, POP)} />
        <div style={{ position: "absolute", left: 110, top: 300, width: 1700, fontFamily: F.head, fontWeight: 800, fontSize: 66, lineHeight: 1.22, color: C.text }}>
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
            top: 580,
            height: 6,
            width: mix(0, 420, s(1, 0)),
            background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
            borderRadius: 3,
          }}
        />
        <At x={110} y={620} w={1600} step={1} delay={6} size={46} weight={600} color={C.text}>
          Ліниві обчислення – мабуть, найпотужніший інструмент модуляризації в арсеналі функційного програміста.
        </At>
        <At x={110} y={810} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
          John Hughes
        </At>
        <At x={110} y={864} w={1600} step={1} delay={36} size={30} weight={400} color={C.dim}>
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
  { id: "quote", title: "Епіграф", steps: [150, 120], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});

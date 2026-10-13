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

/* Epigraph: Hughes's game tree. The generator describes an infinite tree; the evaluator demands nodes one by one,
   and only the demanded part is ever computed. Everything else stays a deferred computation. */
type TNode = { id: string; d: number; x: number; y: number };
const ROOT = { x: 1190, y: 420 };
const ROW = 88;
const SPREAD = [0, 256, 128, 64];
const NODES: TNode[] = (() => {
  const out: TNode[] = [];
  const walk = (id: string, d: number, x: number) => {
    out.push({ id, d, x, y: ROOT.y + d * ROW });
    if (d < 3) {
      walk(id + "0", d + 1, x - SPREAD[d + 1]);
      walk(id + "1", d + 1, x + SPREAD[d + 1]);
    }
  };
  walk("", 0, ROOT.x);
  return out;
})();
const BY_ID: Record<string, TNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));
const FORCE_ORDER = ["", "0", "00", "000", "001", "01", "010", "1", "10", "100"];
const FORCE_AT: Record<string, number> = Object.fromEntries(FORCE_ORDER.map((id, i) => [id, 44 + i * 24]));
const APPEAR_AT = (n: TNode) => (n.id === "" ? 34 : FORCE_AT[n.id.slice(0, -1)] !== undefined ? FORCE_AT[n.id.slice(0, -1)] + 8 : Infinity);
const STOP_AT = FORCE_AT["100"] + 34;

const GameTree: React.FC = () => {
  const { s, lin, t } = useSteps();
  const f = t(0);
  const r = (n: TNode) => (n.d === 3 ? 18 : 22);
  const shown = NODES.filter((n) => f >= APPEAR_AT(n));
  return (
    <>
      <At x={110} y={432} w={560} step={0} delay={36} size={28} weight={600} color={C.lav}>
        генератор описує нескінченне дерево
      </At>
      <At x={110} y={486} w={560} step={0} delay={58} size={28} weight={600} color={C.amber}>
        оцінювач вимагає лише потрібні вузли
      </At>
      <At x={110} y={576} w={560} step={0} delay={STOP_AT - 10} size={28} weight={600} color={C.mint}>
        обчислено {FORCE_ORDER.length} вузлів, решта – відкладені обчислення
      </At>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {shown
          .filter((n) => n.id !== "")
          .map((n) => {
            const parent = BY_ID[n.id.slice(0, -1)];
            const k = lin(0, APPEAR_AT(n), 10);
            const forced = FORCE_AT[n.id] !== undefined ? lin(0, FORCE_AT[n.id] - 2, 8) : 0;
            const dx = n.x - parent.x;
            const dy = n.y - parent.y;
            const len = Math.hypot(dx, dy);
            const x1 = parent.x + (dx / len) * r(parent);
            const y1 = parent.y + (dy / len) * r(parent);
            const x2 = parent.x + (dx / len) * (len - r(n));
            const y2 = parent.y + (dy / len) * (len - r(n));
            return (
              <g key={`e${n.id}`}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={C.dim} strokeWidth={2.2} strokeDasharray="6 7" opacity={0.7} />
                {forced > 0 && <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * forced} y2={y1 + (y2 - y1) * forced} stroke={C.mint} strokeWidth={3} />}
              </g>
            );
          })}
        {shown
          .filter((n) => n.d === 3)
          .map((n) => {
            const k = lin(0, APPEAR_AT(n) + 6, 14);
            return [-1, 1].map((sx) => (
              <line
                key={`s${n.id}${sx}`}
                x1={n.x + sx * 8}
                y1={n.y + r(n) + 2}
                x2={n.x + sx * (8 + 14 * k)}
                y2={n.y + r(n) + 2 + 26 * k}
                stroke={C.dim}
                strokeWidth={2}
                strokeDasharray="3 5"
                opacity={0.75 * (1 - 0.3 * k)}
              />
            ));
          })}
        {FORCE_ORDER.filter((id) => id !== "").map((id) => {
          const n = BY_ID[id];
          const parent = BY_ID[id.slice(0, -1)];
          const p = lin(0, FORCE_AT[id] - 12, 10);
          if (p <= 0 || p >= 1) {
            return null;
          }
          return (
            <circle
              key={`d${id}`}
              cx={parent.x + (n.x - parent.x) * p}
              cy={parent.y + (n.y - parent.y) * p}
              r={7}
              fill={C.amber}
              style={{ filter: "drop-shadow(0 0 8px rgba(242,193,125,0.9))" }}
            />
          );
        })}
        {shown.map((n) => {
          const appear = s(0, APPEAR_AT(n), POP);
          const at = FORCE_AT[n.id];
          const forced = at === undefined ? 0 : s(0, at);
          const flash = at === undefined ? 0 : lin(0, at, 16);
          return (
            <g key={n.id} opacity={Math.min(1, appear)} transform={`translate(${n.x} ${n.y}) scale(${0.6 + 0.4 * Math.min(1, appear)})`}>
              {flash > 0 && flash < 1 && <circle r={r(n) + 18 * flash} fill="none" stroke={C.mint} strokeWidth={3} opacity={1 - flash} />}
              <circle r={r(n)} fill={`rgba(134,224,168,${0.2 * forced})`} stroke={C.dim} strokeWidth={2.5} strokeDasharray="5 5" opacity={0.85 * (1 - forced)} />
              <circle r={r(n)} fill="none" stroke={C.mint} strokeWidth={3} opacity={forced} />
              <text y={7} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={n.d === 3 ? 19 : 22} fill={C.dim} opacity={1 - forced}>
                ?
              </text>
              <circle r={6 * forced} fill={C.mint} />
            </g>
          );
        })}
      </svg>
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
        <GameTree />
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

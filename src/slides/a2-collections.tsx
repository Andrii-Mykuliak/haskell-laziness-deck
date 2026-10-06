import React from "react";
import { C } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Lead, M, Mark, Slide } from "../deck/ui";
import { Cell, RowLabel } from "./common";

/* 5 · Від рекурсії до map */
const S05: React.FC = () => (
  <Slide title="Від рекурсії до map">
    <Lead>У рекурсивних функціях над списками часто повторюється однакова структура обходу.</Lead>
    <Code
      x={96}
      y={330}
      size={42}
      step={1}
      code={`
        incrementAll [] = []
        incrementAll (x:xs) = [[3|(x + 1)]] : incrementAll xs
      `}
    />
    <Code
      x={96}
      y={510}
      size={42}
      step={2}
      code={`
        mapR _ [] = []
        mapR [[3@10|f]] (x:xs) = [[3|f x]] : mapR [[3@10|f]] xs
      `}
    />
    <Arrow x1={726} y1={452} x2={540} y2={574} step={3} delay={4} dur={16} color={C.accentHi} curve={-50} />
    <At x={1020} y={520} w={820} step={3} delay={14} size={38}>
      Конкретна операція над елементом стає <A>параметром-функцією</A>.
    </At>
    <Code x={96} y={700} size={42} step={4} code={`incrementAll = mapR (+ 1)`} />
    <At x={96} y={860} w={1720} step={4} delay={16} size={40}>
      Так рекурсивна схема перетворюється на <A>функційну абстракцію</A>.
    </At>
  </Slide>
);

/* 6 · Типові функційні перетворення */
const BULLETS: React.ReactNode[] = [
  <>
    <M>map</M> змінює кожен елемент і зберігає структуру списку
  </>,
  <>
    <M>filter</M> залишає елементи, які задовольняють предикат
  </>,
  <>
    <M>zipWith</M> поєднує два списки попарно
  </>,
];

const S06: React.FC = () => (
  <Slide title="Типові функційні перетворення">
    <Code
      x={96}
      y={230}
      size={46}
      step={0}
      delay={12}
      stagger={8}
      code={`
        map     :: [[1|(a -> b)]] -> [a] -> [b]
        filter  :: [[2|(a -> Bool)]] -> [a] -> [a]
        zipWith :: [[3|(a -> b -> c)]] -> [a] -> [b] -> [c]
      `}
    />
    {BULLETS.map((b, i) => (
      <At key={i} x={150} y={520 + i * 110} w={1660} step={i + 1} size={42} weight={600}>
        <A c={C.pink}>•</A> {b}
      </At>
    ))}
  </Slide>
);

/* 7 · map, filter, zipWith: приклади */
const DX = 1000;

const MapRow: React.FC<{ y: number }> = ({ y }) => {
  const { s } = useSteps();
  const xs = [1, 2, 3, 4];
  return (
    <>
      {xs.map((v, i) => (
        <React.Fragment key={i}>
          <Cell x={DX + i * 120} y={y} w={96} label={v} color={C.lav} appear={s(1, 4 + i * 4, POP)} />
          <Arrow x1={DX + i * 120 + 48} y1={y + 72} x2={DX + i * 120 + 48} y2={y + 112} step={1} delay={20 + i * 8} dur={10} color={C.dim} width={3} />
          <Cell x={DX + i * 120} y={y + 120} w={96} label={v * v} appear={s(1, 26 + i * 8, POP)} force={s(1, 30 + i * 8)} />
        </React.Fragment>
      ))}
      <RowLabel x={DX + 4 * 120 + 10} y={y + 60} p={s(1, 16)} color={C.amber}>
        (^2)
      </RowLabel>
    </>
  );
};

const FilterRow: React.FC<{ y: number }> = ({ y }) => {
  const { s } = useSteps();
  const xs = Array.from({ length: 10 }, (_, i) => i + 1);
  let j = 0;
  return (
    <>
      {xs.map((v, i) => {
        const keep = v % 2 === 0;
        const judged = s(2, 30 + i * 4);
        if (!keep) {
          return <Cell key={i} x={DX + i * 76} y={y} w={64} h={60} label={v} color={C.lav} appear={s(2, i * 3, POP)} dim={judged} />;
        }
        const k = j++;
        const p = s(2, 36 + i * 4);
        return (
          <React.Fragment key={i}>
            <Cell x={DX + i * 76} y={y} w={64} h={60} label={v} color={C.lav} appear={s(2, i * 3, POP)} />
            <Cell x={DX + i * 76 + (k * 76 - i * 76) * p} y={y + 120 * p} w={64} h={60} label={v} appear={p} glow={p * (1 - s(2, 60 + i * 4))} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const ZipRow: React.FC<{ y: number }> = ({ y }) => {
  const { s } = useSteps();
  const a = [1, 2, 3];
  const b = [10, 20, 30];
  return (
    <>
      {a.map((v, i) => (
        <React.Fragment key={i}>
          <Cell x={DX + i * 120} y={y} w={96} h={60} label={v} color={C.lav} appear={s(3, 4 + i * 4, POP)} />
          <Cell x={DX + i * 120} y={y + 68} w={96} h={60} label={b[i]} color={C.amber} appear={s(3, 12 + i * 4, POP)} />
          <Cell
            x={DX + i * 120}
            y={y + 148}
            w={96}
            h={60}
            label={v + b[i]}
            appear={s(3, 30 + i * 12, POP)}
            force={s(3, 34 + i * 12)}
            glow={s(3, 34 + i * 12) * (1 - s(3, 50 + i * 12))}
          />
        </React.Fragment>
      ))}
      <RowLabel x={DX + 3 * 120 + 10} y={y + 36} p={s(3, 22)} color={C.amber}>
        (+)
      </RowLabel>
    </>
  );
};

const ROWS = [
  { y: 200, step: 1, code: "map (^2) [1, 2, 3, 4]", res: "-- [1, 4, 9, 16]", Row: MapRow },
  { y: 463, step: 2, code: "filter even [1..10]", res: "-- [2, 4, 6, 8, 10]", Row: FilterRow },
  { y: 722, step: 3, code: "zipWith (+) [1,2,3] [10,20,30]", res: "-- [11, 22, 33]", Row: ZipRow },
];

const S07: React.FC = () => (
  <Slide title="map, filter, zipWith: приклади">
    {ROWS.map(({ y, step, code, res, Row }) => (
      <React.Fragment key={step}>
        <Code x={96} y={y + 40} size={40} step={step} code={`${code}\n@${step}+70 ${res}`} />
        <Row y={y} />
      </React.Fragment>
    ))}
    <At x={96} y={962} w={1720} step={4} size={38}>
      Програма описує потрібне перетворення, а не <A>механіку обходу</A> списку.
    </At>
  </Slide>
);

/* 8 · Алгебраїчні властивості map */
const Lane: React.FC<{ x: number; y: number; vals: number[]; p: number; force?: number; color?: string }> = ({ x, y, vals, p, force = 1, color }) => (
  <>
    {vals.map((v, i) => (
      <Cell key={i} x={x + i * 84} y={y} w={72} label={v} appear={p} force={force} color={color} />
    ))}
  </>
);

const S08: React.FC = () => {
  const { s } = useSteps();
  const Y = 700;
  const stepArrow = (x: number, label: string, delay: number) => (
    <>
      <Arrow x1={x} y1={Y + 32} x2={x + 62} y2={Y + 32} step={3} delay={delay} dur={10} color={C.dim} width={3} />
      <RowLabel x={x - 4} y={Y - 46} h={40} p={s(3, delay)} color={C.amber}>
        {label}
      </RowLabel>
    </>
  );
  return (
    <Slide title="Алгебраїчні властивості map">
      <Lead>
        Функційні абстракції мають властивості, які дозволяють міркувати про <A>еквівалентність</A> програм.
      </Lead>
      <Code x={96} y={330} size={52} step={1} code={`map id = id`} />
      <Code x={900} y={340} size={40} step={1} delay={14} code={`map id [1,2,3] = [1,2,3]`} />
      <Mark ok step={1} delay={30} x={1500} y={338} />
      <Code x={96} y={450} size={52} step={2} code={`map (f . g) = map f . map g`} />
      <RowLabel x={96} y={546} h={44} p={s(3, 0)}>
        {"f = (+1),  g = (*2)"}
      </RowLabel>

      <RowLabel x={96} y={Y - 104} h={44} p={s(3, 4)} color={C.lav}>
        map (f . g)
      </RowLabel>
      <Lane x={96} y={Y} vals={[1, 2, 3]} p={s(3, 8, POP)} color={C.lav} />
      {stepArrow(362, "f . g", 22)}
      <Lane x={444} y={Y} vals={[3, 5, 7]} p={s(3, 30, POP)} force={s(3, 34)} />
      <Mark ok step={3} delay={46} x={710} y={Y + 6} />
      <At x={96} y={Y + 90} step={3} delay={40} size={30} weight={400} color={C.dim}>
        один прохід
      </At>

      <RowLabel x={860} y={Y - 104} h={44} p={s(3, 54)} color={C.lav}>
        map f . map g
      </RowLabel>
      <Lane x={860} y={Y} vals={[1, 2, 3]} p={s(3, 58, POP)} color={C.lav} />
      {stepArrow(1112, "g", 70)}
      <Lane x={1190} y={Y} vals={[2, 4, 6]} p={s(3, 78, POP)} force={s(3, 82)} color={C.amber} />
      {stepArrow(1442, "f", 92)}
      <Lane x={1520} y={Y} vals={[3, 5, 7]} p={s(3, 100, POP)} force={s(3, 104)} />
      <Mark ok step={3} delay={116} x={1790} y={Y + 6} />
      <At x={860} y={Y + 90} step={3} delay={110} size={30} weight={400} color={C.dim}>
        два проходи, той самий результат
      </At>

      <At x={96} y={920} w={1720} step={4} size={38}>
        Ці рівності показують, що перетворення списку узгоджується з <A>композицією функцій</A>.
      </At>
    </Slide>
  );
};

export const a2Slides: SlideDef[] = [
  { id: "rec-to-map", title: "Від рекурсії до map", steps: [40, 50, 50, 60, 70], C: S05 },
  { id: "transforms", title: "Типові перетворення", steps: [60, 50, 50, 50], C: S06 },
  { id: "examples", title: "map, filter, zipWith", steps: [30, 90, 110, 90, 55], C: S07 },
  { id: "map-laws", title: "Властивості map", steps: [40, 55, 55, 140, 55], C: S08 },
];


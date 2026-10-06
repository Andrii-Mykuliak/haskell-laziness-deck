import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { a1Slides } from "./a1-abstraction";
import { a2Slides } from "./a2-collections";
import { a3Slides } from "./a3-composition";
import { a4Slides } from "./a4-strictness";
import { a5Slides } from "./a5-thunks";
import { a6Slides, summarySlide } from "./a6-infinite";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...a1Slides,
  agendaSlide(1),
  ...a2Slides,
  agendaSlide(2),
  ...a3Slides,
  agendaSlide(3),
  ...a4Slides,
  agendaSlide(4),
  ...a5Slides,
  agendaSlide(5),
  ...a6Slides,
  summarySlide,
  outroSlide,
];

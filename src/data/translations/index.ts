import { Language } from "@/types/journey";
import { en } from "./en";
import { hi } from "./hi";
import { kn } from "./kn";
import { bn } from "./bn";
import { te } from "./te";
import { ta } from "./ta";
import { mr } from "./mr";
import { gu } from "./gu";
import { ml } from "./ml";
import { pa } from "./pa";
import { or } from "./or";

export type TranslationKey = keyof typeof en;

export const translations: Record<Language, typeof en> = {
  EN: en,
  HI: hi,
  KN: kn,
  BN: bn,
  TE: te,
  TA: ta,
  MR: mr,
  GU: gu,
  ML: ml,
  PA: pa,
  OR: or,
};

export { en, hi, kn, bn, te, ta, mr, gu, ml, pa, or };

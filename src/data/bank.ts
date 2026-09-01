import type { BankUnit, Vocab } from "../types";
import { bank1 } from "./bank1";
import { bank2 } from "./bank2";
import { bank3 } from "./bank3";
import { bank4 } from "./bank4";
import { bank5 } from "./bank5";
import { bank6 } from "./bank6";
import { bank7 } from "./bank7";

export const BANK_UNITS: BankUnit[] = [
  ...bank1,
  ...bank2,
  ...bank3,
  ...bank4,
  ...bank5,
  ...bank6,
  ...bank7,
];

export interface ParsedUnit {
  id: string;
  topic: number;
  tag?: string;
  title: string;
  emoji: string;
  desc: string;
  words: Vocab[];
}

/**
 * Trasforma le righe "ko|romanizzazione|italiano|emoji" in vocaboli.
 * Le parole già presenti nelle lezioni (o in un'unità precedente) vengono
 * scartate, così ogni parola ha una sola carta di ripasso.
 */
export const parseBank = (taken: Set<string>): ParsedUnit[] =>
  BANK_UNITS.map((u) => {
    const words: Vocab[] = [];
    u.words
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [ko, ro, it, emoji] = line.split("|").map((x) => x.trim());
        if (!ko || !ro || !it) return;
        if (taken.has(ko)) return;
        taken.add(ko);
        words.push({
          id: `${u.id}#${words.length}`,
          ko,
          ro,
          it,
          emoji: emoji || undefined,
          unit: u.id,
        });
      });
    return {
      id: u.id,
      topic: u.topic,
      tag: u.tag,
      title: u.title,
      emoji: u.emoji,
      desc: u.desc,
      words,
    };
  });

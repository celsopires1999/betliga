import { GameDay } from "./GameDay";

export type Result = {
  liga: {
    id: string;
    name: string;
  };
  gameDay: GameDay;
};

export type Score = {
  gameNumber: number;
  homeGols: number | null;
  awayGols: number | null;
};

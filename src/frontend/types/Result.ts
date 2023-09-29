import { GameDay } from "./GameDay";

export type Result = {
  liga: {
    id: string;
    name: string;
  };
  gameDay: GameDay;
  resultScores: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

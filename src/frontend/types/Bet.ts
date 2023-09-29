import { GameDay } from "./GameDay";

export type Bet = {
  liga: {
    id: string;
    name: string;
  };
  better: {
    id: string;
    name: string;
  };
  gameDay: GameDay;
  betScores: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

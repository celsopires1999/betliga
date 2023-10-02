import { Game } from "./Game";
import { Liga } from "./Liga";

export type GameDay = {
  id: string;
  ligaId: string;
  liga: Liga;
  round: number;
  games: Game[];
};

export type GameDayEvaluation = {
  id: string;
  round: number;
  liga: {
    id: string;
    name: string;
  };
  games: {
    id: string;
    gameNumber: number;
    home: string;
    away: string;
    homeGols: number | null;
    awayGols: number | null;
  }[];
  bets: {
    id: string;
    better: {
      id: string;
      name: string;
    };
    points: number | null;
    scores: {
      id: string;
      gameNumber: number;
      points: number | null;
      home: string;
      away: string;
      homeGols: number;
      awayGols: number;
    }[];
  }[];
};

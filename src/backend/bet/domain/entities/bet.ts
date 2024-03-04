import { Game } from "@/backend/game-day/domain/entities/game";
import { v4 as uuidv4 } from "uuid";
import {
  BetScore,
  BetScoreParams,
  BetScorePropsJson,
  ChangeBetScoreParams,
} from "./bet-score";

export type BetRestoreParams = {
  id: string;
  gameDayId: string;
  betterId: string;
  betScores: BetScoreParams[];
  points: number | null;
};

export type BetCreateParams = Omit<BetRestoreParams, "id" | "betScores"> & {
  betScores: Omit<BetScoreParams, "id" | "betId" | "column" | "points">[];
};

export type BetPropsJson = Omit<BetRestoreParams, "betScores"> & {
  betScores: BetScorePropsJson[];
};

type BetProps = Omit<BetRestoreParams, "betScores"> & {
  betScores: BetScore[];
};

export class Bet {
  id: string;
  gameDayId: string;
  betterId: string;
  betScores: BetScore[];
  points: number | null;

  constructor(props: BetProps) {
    this.id = props.id;
    this.gameDayId = props.gameDayId;
    this.betterId = props.betterId;
    this.betScores = props.betScores;
    this.points = props.points;
  }

  static create(params: BetCreateParams) {
    const id = uuidv4();
    const betScores = params.betScores.map((b) =>
      BetScore.create({ ...b, betId: id })
    );
    return new Bet({ ...params, betScores, id });
  }

  static restore(props: BetRestoreParams) {
    const betScores = props.betScores.map((b) => BetScore.restore(b));
    return new Bet({ ...props, betScores });
  }

  calculatePoints(games: Game[]) {
    let points = 0;
    this.betScores.forEach((b) => {
      const index = games.findIndex((g) => b.gameId === g.id);
      if (index !== -1) {
        points = points + b.calculatePoints(games[index]);
      }
    });
    this.points = points;
  }

  changeScores(scores: ChangeBetScoreParams[]) {
    this.betScores.forEach((b) => {
      const index = scores.findIndex((s) => s.gameId === b.gameId);
      if (index !== -1) {
        b.changeScore(scores[index]);
      }
    });
  }

  toJSON(): BetPropsJson {
    return {
      ...this,
      betScores: this.betScores.map((b) => b.toJSON()),
    };
  }
}

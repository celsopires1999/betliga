import { ResultScore } from "@/backend/result/domain/entities/result-score";
import { v4 as uuidv4 } from "uuid";
import { BetScore, BetScoreParams, BetScorePropsJson } from "./bet-score";

export type BetRestoreParams = {
  id: string;
  gameDayId: string;
  betterId: string;
  betScores: BetScoreParams[];
  points: number | null;
};

export type BetCreateParams = Omit<BetRestoreParams, "id" | "betScores"> & {
  betScores: Omit<BetScoreParams, "id" | "column" | "points">[];
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
    const betScores = params.betScores.map((b) => BetScore.create(b));
    return new Bet({ ...params, betScores, id: uuidv4() });
  }

  static restore(props: BetRestoreParams) {
    const betScores = props.betScores.map((b) => BetScore.restore(b));
    return new Bet({ ...props, betScores });
  }

  calculatePoints(resultScores: ResultScore[]) {
    let points = 0;
    for (let i = 0; i < this.betScores.length; i++) {
      this.betScores[i], resultScores[i];
      points = points + this.betScores[i].calculatePoints(resultScores[i]);
    }
    this.points = points;
  }

  toJSON(): BetPropsJson {
    return {
      ...this,
      betScores: this.betScores.map((b) => {
        b.toJSON();
      }),
    };
  }
}

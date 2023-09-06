import { ResultScore } from "@/backend/result/domain/entities/result-score";
import { v4 as uuidv4 } from "uuid";

export type BetScoreParams = {
  id: string;
  gameId: string;
  betId: string;
  homeGols: number;
  awayGols: number;
  column: string;
  points: number | null;
};

export type BetScoreProps = BetScoreParams;

export type BetScorePropsJson = BetScoreParams;

export class BetScore {
  id: string;
  gameId: string;
  betId: string;
  homeGols: number;
  awayGols: number;
  column: string;
  points: number | null;

  constructor(props: BetScoreProps) {
    this.id = props.id;
    this.gameId = props.gameId;
    this.betId = props.betId;
    this.homeGols = props.homeGols;
    this.awayGols = props.awayGols;
    this.column = props.column;
    this.points = props.points;
  }

  static create(params: Omit<BetScoreParams, "id" | "column" | "points">) {
    const column = BetScore.defineColumn(params.homeGols, params.awayGols);
    return new BetScore({ ...params, column, points: null, id: uuidv4() });
  }

  static defineColumn(homeGols: number, awayGols: number) {
    if (homeGols > awayGols) {
      return "1";
    }
    if (homeGols < awayGols) {
      return "2";
    }
    return "X";
  }

  static restore(params: BetScoreParams) {
    return new BetScore(params);
  }

  calculatePoints(resultScore: ResultScore) {
    const checkScore = this.checkScore(resultScore);
    if (this.column === resultScore.column) {
      if (this.column === "1") {
        if (checkScore) {
          this.points = 5;
        } else {
          this.points = 4;
        }
      } else {
        if (checkScore) {
          this.points = 10;
        } else {
          this.points = 8;
        }
      }
    } else {
      this.points = 0;
    }
    return this.points;
  }

  private checkScore(resultScore: ResultScore) {
    if (
      this.homeGols === resultScore.homeGols &&
      this.awayGols === resultScore.awayGols
    ) {
      return true;
    }
    return false;
  }

  toJSON(): BetScorePropsJson {
    return {
      ...this,
    };
  }
}

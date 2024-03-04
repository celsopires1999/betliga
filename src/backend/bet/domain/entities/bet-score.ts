import { Game } from "@/backend/game-day/domain/entities/game";
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

export type ChangeBetScoreParams = Omit<
  BetScoreParams,
  "id" | "betId" | "column" | "points"
>;

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

  calculatePoints(game: Game) {
    const checkScore = this.checkScore(game);
    if (this.column === game.column) {
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

  private checkScore(game: Game) {
    if (this.homeGols === game.homeGols && this.awayGols === game.awayGols) {
      return true;
    }
    return false;
  }

  changeScore(score: ChangeBetScoreParams) {
    this.homeGols = score.homeGols;
    this.awayGols = score.awayGols;
    this.column = BetScore.defineColumn(score.homeGols, score.awayGols);
    this.points = null;
  }

  toJSON(): BetScorePropsJson {
    return {
      ...this,
    };
  }
}

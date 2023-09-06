import { v4 as uuidv4 } from "uuid";

export type GameProps = {
  id: string;
  gameDayId: string;
  gameNumber: number;
  homeId: string;
  awayId: string;
  homeGols: number | null;
  awayGols: number | null;
  column: string | null;
};

export type GameCreateParams = Omit<
  GameProps,
  "id" | "homeGols" | "awayGols" | "column"
>;

export type GameRestoreParams = GameProps;

export type GamePropsJson = GameProps;

export class Game {
  id: string;
  gameDayId: string;
  gameNumber: number;
  homeId: string;
  awayId: string;
  homeGols: number | null;
  awayGols: number | null;
  column: string | null;

  constructor(props: GameProps) {
    this.id = props.id;
    this.gameDayId = props.gameDayId;
    this.gameNumber = props.gameNumber;
    this.homeId = props.homeId;
    this.awayId = props.awayId;
    this.homeGols = props.homeGols;
    this.awayGols = props.awayGols;
    this.column = props.column;
  }

  static create(params: GameCreateParams) {
    return new Game({
      ...params,
      homeGols: null,
      awayGols: null,
      column: null,
      id: uuidv4(),
    });
  }

  static restore(params: GameRestoreParams) {
    return new Game(params);
  }

  updateScore(homeGols: number, awayGols: number) {
    this.homeGols = homeGols;
    this.awayGols = awayGols;
    this.column = this.defineColumn();
  }

  defineColumn() {
    if (!this.homeGols || !this.awayGols) {
      return null;
    }
    if (this.homeGols > this.awayGols) {
      return "1";
    }
    if (this.homeGols < this.awayGols) {
      return "2";
    }
    return "X";
  }

  toJSON(): GamePropsJson {
    return {
      ...this,
    };
  }
}

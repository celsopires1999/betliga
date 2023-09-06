import { v4 as uuidv4 } from "uuid";

export type ResultScoreProps = {
  id: string;
  gameId: string;
  homeGols: number;
  awayGols: number;
  column: string;
};

export type ResultScoreParams = ResultScoreProps;

export type ResultScorePropsJson = ResultScoreParams;

export class ResultScore {
  id: string;
  gameId: string;
  homeGols: number;
  awayGols: number;
  column: string;

  constructor(props: ResultScoreProps) {
    this.id = props.id;
    this.gameId = props.gameId;
    this.homeGols = props.homeGols;
    this.awayGols = props.awayGols;
    this.column = props.column;
  }

  static create(props: Omit<ResultScoreParams, "id" | "column">) {
    const column = ResultScore.defineColumn(props.homeGols, props.awayGols);
    return new ResultScore({ ...props, column, id: uuidv4() });
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

  static restore(params: ResultScoreParams) {
    return new ResultScore(params);
  }

  toJSON(): ResultScorePropsJson {
    return {
      ...this,
    };
  }
}

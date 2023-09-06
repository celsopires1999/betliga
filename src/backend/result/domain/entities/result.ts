import { v4 as uuidv4 } from "uuid";
import {
  ResultScore,
  ResultScoreParams,
  ResultScorePropsJson,
} from "./result-score";

export type ResultRestoreParams = {
  id: string;
  gameDayId: string;
  resultScores: ResultScoreParams[];
};

export type ResultCreateParams = Omit<
  ResultRestoreParams,
  "id" | "resultScores"
> & {
  resultScores: Omit<ResultScoreParams, "id" | "column">[];
};

export type ResultPropsJson = Omit<ResultRestoreParams, "resultScores"> & {
  resultScores: ResultScorePropsJson[];
};

type ResultProps = Omit<ResultRestoreParams, "resultScores"> & {
  resultScores: ResultScore[];
};

export class Result {
  id: string;
  gameDayId: string;
  resultScores: ResultScore[];

  constructor(props: ResultProps) {
    this.id = props.id;
    this.gameDayId = props.gameDayId;
    this.resultScores = props.resultScores;
  }

  static create(params: ResultCreateParams) {
    const resultScores = params.resultScores.map((r) => ResultScore.create(r));
    return new Result({ ...params, resultScores, id: uuidv4() });
  }

  static restore(params: ResultRestoreParams) {
    const resultScores = params.resultScores.map((r) => ResultScore.restore(r));
    return new Result({ ...params, resultScores });
  }

  toJSON(): ResultPropsJson {
    return {
      ...this,
      resultScores: this.resultScores.map((r) => {
        r.toJSON();
      }),
    };
  }
}

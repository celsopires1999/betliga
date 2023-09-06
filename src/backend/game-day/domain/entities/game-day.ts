import { v4 as uuidv4 } from "uuid";
import {
  Game,
  GameCreateParams,
  GamePropsJson,
  GameRestoreParams,
} from "./game";

export type GameDayProps = {
  id: string;
  ligaId: string;
  round: number;
  games: Game[];
};

export type GameDayCreateParams = Omit<GameDayProps, "id" | "games"> & {
  games: GameCreateParams[];
};

export type GameDayRestoreParams = Omit<GameDayProps, "games"> & {
  games: GameRestoreParams[];
};

export type GameDayPropsJson = Omit<GameDayProps, "games"> & {
  games: GamePropsJson[];
};

export class GameDay {
  id: string;
  ligaId: string;
  round: number;
  games: Game[];

  constructor(props: GameDayProps) {
    this.id = props.id;
    this.ligaId = props.ligaId;
    this.round = props.round;
    this.games = props.games;
  }

  static create(params: GameDayCreateParams) {
    const games = params.games.map((g) => Game.create(g));
    return new GameDay({ ...params, games, id: uuidv4() });
  }

  static restore(params: GameDayRestoreParams) {
    const games = params.games.map((g) => Game.restore(g));
    return new GameDay({ ...params, games });
  }

  toJSON(): GameDayPropsJson {
    return {
      ...this,
      games: this.games.map((g) => g.toJSON()),
    };
  }
}

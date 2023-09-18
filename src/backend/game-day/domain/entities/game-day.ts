import { v4 as uuidv4 } from "uuid";
import { Game, GamePropsJson, GameRestoreParams } from "./game";

export type GameDayProps = {
  id: string;
  ligaId: string;
  round: number;
  games: Game[];
};

export type GameDayCreateParams = Omit<GameDayProps, "id" | "games"> & {
  games: {
    gameNumber: number;
    homeId: string;
    awayId: string;
  }[];
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
    const id = uuidv4();
    const games = params.games.map((g) => Game.create({ ...g, gameDayId: id }));
    return new GameDay({ ...params, games, id });
  }

  static restore(params: GameDayRestoreParams) {
    const games = params.games.map((g) => Game.restore(g));
    return new GameDay({ ...params, games });
  }

  updateScores(
    params: {
      gameNumber: number;
      homeGols: number;
      awayGols: number;
    }[]
  ) {
    this.games.forEach((g) => {
      const index = params.findIndex((p) => p.gameNumber === g.gameNumber);
      if (index !== -1) {
        g.updateScore(params[index].homeGols, params[index].awayGols);
      }
    });
  }

  toJSON(): GameDayPropsJson {
    return {
      ...this,
      games: this.games.map((g) => g.toJSON()),
    };
  }
}

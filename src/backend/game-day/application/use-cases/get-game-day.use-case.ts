import { IGameDayDAO } from "../../query/game-day.dao";

export class GetGameDayUseCase {
  constructor(private gameDayDAO: IGameDayDAO) {}
  async execute(input: GetGameDayInput): Promise<GetGameDayOutput> {
    const qryResult = await this.gameDayDAO.findCompleteById(input.id);
    return qryResult.toJSON();
  }
}

export type GetGameDayInput = {
  id: string;
};

export type GetGameDayOutput = {
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

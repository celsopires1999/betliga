import { IGameDayDAO } from "../../query/game-day.dao";
import { GameDayDTO } from "../../query/game-day.dto";

export class ListGameDaysByLiga {
  constructor(private gameDayDAO: IGameDayDAO) {}

  async execute(input: ListGameDaysInput): Promise<ListGameDaysOutput> {
    const qryResult = await this.gameDayDAO.listByLiga(input.ligaId);
    return qryResult;
  }
}

export type ListGameDaysInput = {
  ligaId: string;
};

export type ListGameDaysOutput = GameDayDTO.ListByLiga[];

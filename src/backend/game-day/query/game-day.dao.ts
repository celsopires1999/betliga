import { GameDayDTO } from "./game-day.dto";

export interface IGameDayDAO {
  findCompleteById(id: string): Promise<GameDayDTO.Complete>;
  listByLiga(ligaId: string): Promise<GameDayDTO.ListByLiga[]>;
}

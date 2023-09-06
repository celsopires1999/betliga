import { GameDay } from "../entities/game-day";

export interface IGameDayRepository {
  update(entity: GameDay): Promise<void>;
  findById(id: string): Promise<GameDay>;
  findAll(): Promise<GameDay[]>;
}

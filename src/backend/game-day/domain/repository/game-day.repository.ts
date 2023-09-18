import { GameDay } from "../entities/game-day";

export interface IGameDayRepository {
  insert(entity: GameDay): Promise<void>;
  update(entity: GameDay): Promise<void>;
  findById(id: string): Promise<GameDay>;
  findByByRound(ligaId: string, round: number): Promise<GameDay>;
  findAll(): Promise<GameDay[]>;
}

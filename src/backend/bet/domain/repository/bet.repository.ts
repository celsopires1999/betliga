import { Bet } from "../entities/bet";

export interface IBetRepository {
  insert(entity: Bet): Promise<void>;
  update(entity: Bet): Promise<void>;
  findById(id: string): Promise<Bet>;
  findAll(): Promise<Bet[]>;
  search(params: { gameDayId: string }): Promise<Bet[]>;
}

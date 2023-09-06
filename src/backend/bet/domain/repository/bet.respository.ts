import { Bet } from "../entities/bet";

export interface IBetRepository {
  findById(id: string): Promise<Bet>;
  findAll(): Promise<Bet[]>;
  search(params: { gameDayId: string }): Promise<Bet[]>;
}

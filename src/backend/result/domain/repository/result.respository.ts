import { Result } from "../entities/result";

export interface IResultRepository {
  findById(id: string): Promise<Result>;
  findAll(): Promise<Result[]>;
  search(params: { gameDayId: string }): Promise<Result>;
}

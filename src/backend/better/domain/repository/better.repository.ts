import { Better } from "../entities/better";

export interface IBetterRepository {
  bulkInsert(entities: Better[]): Promise<void>;
  findById(id: string): Promise<Better>;
  findByName(name: string): Promise<Better>;
  findAll(): Promise<Better[]>;
}

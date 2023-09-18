import { Liga } from "../entities/liga";

export interface ILigaRepository {
  bulkInsert(entities: Liga[]): Promise<void>;
  findById(id: string): Promise<Liga>;
  findByName(name: string): Promise<Liga>;
  findAll(): Promise<Liga[]>;
}

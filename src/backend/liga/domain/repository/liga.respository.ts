import { Liga } from "../entities/liga";

export interface ILigaRepository {
  findById(id: string): Promise<Liga>;
  findAll(): Promise<Liga[]>;
}

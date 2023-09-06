import { Better } from "../entities/better";

export interface IBetterRepository {
  findById(id: string): Promise<Better>;
  findAll(): Promise<Better[]>;
}

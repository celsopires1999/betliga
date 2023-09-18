import { Team } from "../entities/team";

export interface ITeamRepository {
  bulkInsert(entities: Team[]): Promise<void>;
  findById(id: string): Promise<Team>;
  findByName(name: string): Promise<Team>;
  findAll(): Promise<Team[]>;
}

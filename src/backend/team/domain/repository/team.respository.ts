import { Team } from "../entities/team";

export interface ITeamRepository {
  findById(id: string): Promise<Team>;
  findAll(): Promise<Team[]>;
}

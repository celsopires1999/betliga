import { ITeamRepository } from "../../domain/repository/team.repository";

export class ListTeamsUseCase {
  constructor(private teamRepo: ITeamRepository) {}
  async execute(input: ListTeamsInput): Promise<ListTeamsOutput> {
    const teams = await this.teamRepo.findAll();
    return teams.map((t) => {
      return {
        id: t.id,
        name: t.name,
      };
    });
  }
}

export type ListTeamsInput = void;

export type ListTeamsOutput = {
  id: string;
  name: string;
}[];

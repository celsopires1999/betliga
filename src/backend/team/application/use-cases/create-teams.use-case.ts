import { Team } from "../../domain/entities/team";
import { ITeamRepository } from "../../domain/repository/team.repository";

export class CreateTeamsUseCase {
  constructor(private teamRepo: ITeamRepository) {}

  async execute(input: CreateTeamsInput): Promise<CreateTeamsOutput> {
    const teams = input.names.map((n) => Team.create({ name: n }));
    await this.teamRepo.bulkInsert(teams);

    return teams.map((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });
  }
}

type CreateTeamsInput = { names: string[] };

type CreateTeamsOutput = {
  id: string;
  name: string;
}[];

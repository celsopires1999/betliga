import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";
import { prisma } from "@/backend/@prisma/prisma";
import { Team } from "../../../domain/entities/team";
import { ITeamRepository } from "../../../domain/repository/team.respository";

export class TeamPrismaRepository implements ITeamRepository {
  async findById(id: string): Promise<Team> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Team.restore({
      ...model,
    });
  }

  async findAll(): Promise<Team[]> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string) {
    try {
      return await prisma.teamModel.findUniqueOrThrow({
        where: { id },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

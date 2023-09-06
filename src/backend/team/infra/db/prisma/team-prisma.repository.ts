import { prisma } from "@/backend/@prisma/prisma";
import {
  checkDuplicatedError,
  checkNotFoundError,
} from "@/backend/@seedwork/infra/db/prisma/utils";
import { Team } from "../../../domain/entities/team";
import { ITeamRepository } from "../../../domain/repository/team.repository";

export class TeamPrismaRepository implements ITeamRepository {
  async bulkInsert(entities: Team[]): Promise<void> {
    const teams = entities.map((e) => e.toJSON());
    try {
      await prisma.teamModel.createMany({
        data: teams,
      });
    } catch (e) {
      throw checkDuplicatedError(
        `There are errors on creating multiple teams ${entities
          .map((entity) => entity.name)
          .join(", ")}`,
        e
      );
    }
  }

  async findById(id: string): Promise<Team> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Team.restore({
      ...model,
    });
  }

  async findByName(name: string): Promise<Team> {
    try {
      const model = await prisma.teamModel.findFirstOrThrow({
        where: { name },
      });
      return Team.restore({ id: model.id, name: model.name });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using Name ${name}`, e);
    }
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

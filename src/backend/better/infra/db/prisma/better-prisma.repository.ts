import { prisma } from "@/backend/@prisma/prisma";
import {
  checkDuplicatedError,
  checkNotFoundError,
} from "@/backend/@seedwork/infra/db/prisma/utils";
import { Better } from "../../../domain/entities/better";
import { IBetterRepository } from "../../../domain/repository/better.repository";

export class BetterPrismaRepository implements IBetterRepository {
  async bulkInsert(entities: Better[]): Promise<void> {
    const betters = entities.map((e) => e.toJSON());
    try {
      await prisma.betterModel.createMany({
        data: betters,
      });
    } catch (e) {
      throw checkDuplicatedError(
        `There are errors on creating multiple betters ${entities
          .map((entity) => entity.name)
          .join(", ")}`,
        e
      );
    }
  }

  async findById(id: string): Promise<Better> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Better.restore({
      ...model,
    });
  }

  async findByName(name: string): Promise<Better> {
    try {
      const model = await prisma.betterModel.findUniqueOrThrow({
        where: { name },
      });
      return Better.restore({ id: model.id, name: model.name });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using Name ${name}`, e);
    }
  }

  async findAll(): Promise<Better[]> {
    try {
      const models = await prisma.betterModel.findMany({
        orderBy: { name: "asc" },
      });
      return models.map((m) => Better.restore({ id: m.id, name: m.name }));
    } catch (e) {
      throw e;
    }
  }

  private async _get(id: string) {
    try {
      return await prisma.betterModel.findUniqueOrThrow({
        where: { id },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

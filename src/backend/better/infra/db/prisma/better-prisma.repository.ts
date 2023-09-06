import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";
import { prisma } from "@/backend/@prisma/prisma";
import { Better } from "../../../domain/entities/better";
import { IBetterRepository } from "../../../domain/repository/better.respository";

export class BetterPrismaRepository implements IBetterRepository {
  async findById(id: string): Promise<Better> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Better.restore({
      ...model,
    });
  }

  async findAll(): Promise<Better[]> {
    throw new Error("Method not implemented.");
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

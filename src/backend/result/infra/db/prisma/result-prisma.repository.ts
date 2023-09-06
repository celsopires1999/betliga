import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";
import { prisma } from "@/backend/@prisma/prisma";
import { Result } from "../../../domain/entities/result";
import { IResultRepository } from "../../../domain/repository/result.respository";

export class ResultPrismaRepository implements IResultRepository {
  async findById(id: string): Promise<Result> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Result.restore({
      ...model,
    });
  }
  async findAll(): Promise<Result[]> {
    throw new Error("Method not implemented.");
  }

  async search(params: { gameDayId: string }): Promise<Result> {
    const models = await prisma.resultModel.findMany({
      where: {
        gameDayId: params.gameDayId,
      },
      include: { resultScores: {} },
    });

    return Result.restore(models[0]);
  }

  private async _get(id: string) {
    try {
      return await prisma.resultModel.findUniqueOrThrow({
        where: { id },
        include: { resultScores: {} },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

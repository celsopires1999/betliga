import { prisma } from "@/backend/@prisma/prisma";
import { Bet } from "../../../domain/entities/bet";
import { IBetRepository } from "../../../domain/repository/bet.respository";
import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";

export class BetPrismaRepository implements IBetRepository {
  async findById(id: string): Promise<Bet> {
    let _id = `${id}`;
    const model = await this._get(_id);
    return Bet.restore({
      ...model,
    });
  }
  async findAll(): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  async search(params: { gameDayId: string }): Promise<Bet[]> {
    const models = await prisma.betModel.findMany({
      where: {
        gameDayId: params.gameDayId,
      },
      include: { betScores: {} },
    });

    return models.map((b) => Bet.restore(b));
  }

  private async _get(id: string) {
    try {
      return await prisma.betModel.findUniqueOrThrow({
        where: { id },
        include: { betScores: {} },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

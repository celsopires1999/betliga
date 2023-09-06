import { prisma } from "@/backend/@prisma/prisma";
import {
  checkDuplicatedError,
  checkNotFoundError,
} from "@/backend/@seedwork/infra/db/prisma/utils";
import { Bet } from "../../../domain/entities/bet";
import { IBetRepository } from "../../../domain/repository/bet.repository";

export class BetPrismaRepository implements IBetRepository {
  async insert(entity: Bet): Promise<void> {
    try {
      const betModel = entity.toJSON();
      await prisma.$transaction(async (prisma) => {
        await prisma.betModel.create({
          data: {
            id: betModel.id,
            betterId: betModel.betterId,
            gameDayId: betModel.gameDayId,
            betScores: {
              createMany: {
                data: betModel.betScores.map((s) => {
                  return {
                    id: s.id,
                    gameId: s.gameId,
                    homeGols: s.homeGols,
                    awayGols: s.awayGols,
                    column: s.column,
                  };
                }),
              },
            },
          },
          include: {
            betScores: {
              include: { game: {} },
            },
          },
        });
      });
    } catch (e) {
      throw checkDuplicatedError(
        `Entity exists already with ID ${entity.id}`,
        e
      );
    }
  }

  async update(entity: Bet): Promise<void> {
    try {
      const { id, betScores, ...data } = entity.toJSON();
      await prisma.$transaction(async (prisma) => {
        await prisma.betModel.update({
          where: { id },
          data,
        });
        await prisma.betScoreModel.deleteMany({
          where: { betId: id },
        });
        await prisma.betScoreModel.createMany({
          data: betScores,
        });
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${entity.id}`, e);
    }
  }

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

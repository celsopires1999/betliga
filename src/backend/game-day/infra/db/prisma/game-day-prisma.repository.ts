import { prisma } from "@/backend/@prisma/prisma";
import { checkNotFoundError } from "@/backend/@seedwork/infra/db/prisma/utils";
import { GameDay } from "../../../domain/entities/game-day";
import { IGameDayRepository } from "../../../domain/repository/game-day.respository";

export class GameDayPrismaRepository implements IGameDayRepository {
  async update(entity: GameDay): Promise<void> {
    try {
      const { id, games, ...data } = entity.toJSON();
      await prisma.$transaction(async (prisma) => {
        await prisma.gameDayModel.update({
          where: { id },
          data,
        });
        await prisma.gameModel.deleteMany({
          where: { gameDayId: id },
        });
        await prisma.gameModel.createMany({
          data: games,
        });
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${entity.id}`, e);
    }
  }

  async findById(id: string): Promise<GameDay> {
    const _id = `${id}`;
    const model = await this._get(_id);
    return GameDay.restore({
      ...model,
    });
  }

  async findAll(): Promise<GameDay[]> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string) {
    try {
      return await prisma.gameDayModel.findUniqueOrThrow({
        where: { id },
        include: { games: {} },
      });
    } catch (e) {
      throw checkNotFoundError(`Entity not found using ID ${id}`, e);
    }
  }
}

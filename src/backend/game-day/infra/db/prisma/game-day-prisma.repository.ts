import { prisma } from "@/backend/@prisma/prisma";
import {
  checkDuplicatedError,
  checkNotFoundError,
} from "@/backend/@seedwork/infra/db/prisma/utils";
import { GameDay } from "../../../domain/entities/game-day";
import { IGameDayRepository } from "../../../domain/repository/game-day.repository";

export class GameDayPrismaRepository implements IGameDayRepository {
  async insert(entity: GameDay): Promise<void> {
    try {
      const { games, ...data } = entity.toJSON();
      await prisma.$transaction(async (prisma) => {
        await prisma.gameDayModel.create({
          data,
        });
        await prisma.gameModel.createMany({
          data: games,
        });
      });
    } catch (e) {
      throw checkDuplicatedError(
        `Entity exists already using ID ${entity.id}`,
        e
      );
    }
  }

  async update(entity: GameDay): Promise<void> {
    try {
      const { id, games, ...data } = entity.toJSON();
      await prisma.$transaction(async (prisma) => {
        const gameDay = await prisma.gameDayModel.findUniqueOrThrow({
          where: { id },
          include: { games: {} },
        });

        await prisma.gameDayModel.update({
          where: { id },
          data,
        });

        for (const currentGame of gameDay.games) {
          const foundGame = games.find((g) => g.id === currentGame.id);
          if (foundGame) {
            await prisma.gameModel.update({
              where: { id: foundGame.id },
              data: {
                gameDayId: foundGame.gameDayId,
                gameNumber: foundGame.gameNumber,
                homeId: foundGame.homeId,
                homeGols: foundGame.homeGols,
                awayId: foundGame.awayId,
                awayGols: foundGame.awayGols,
                column: foundGame.column,
              },
            });
          } else {
            await prisma.gameModel.delete({
              where: { id: currentGame.id },
            });
          }
        }

        for (const game of games) {
          const updateGame = gameDay.games.findIndex(
            (currentGame) => currentGame.id === game.id
          );
          if (updateGame === -1) {
            await prisma.gameModel.create({
              data: game,
            });
          }
        }
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

  async findByRound(ligaId: string, round: number): Promise<GameDay> {
    try {
      const model = await prisma.gameDayModel.findFirstOrThrow({
        where: { ligaId, round },
        include: { games: {} },
      });
      return GameDay.restore({
        ...model,
      });
    } catch (e) {
      throw checkNotFoundError(
        `Entity not found using ligaId ${ligaId} round ${round}`,
        e
      );
    }
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

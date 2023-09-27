import { prisma } from "@/backend/@prisma/prisma";
import { IGameDayDAO } from "./game-day.dao";
import { GameDayDTO } from "./game-day.dto";

export class GameDayPrismaDAO implements IGameDayDAO {
  async findCompleteById(id: string): Promise<GameDayDTO.Complete> {
    const model = await prisma.gameDayModel.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        round: true,
        liga: { select: { id: true, name: true } },
        games: {
          select: {
            id: true,
            gameNumber: true,
            homeGols: true,
            awayGols: true,
            home: { select: { name: true } },
            away: { select: { name: true } },
          },
        },
        bets: {
          select: {
            id: true,
            points: true,
            better: { select: { id: true, name: true } },
            betScores: {
              select: {
                id: true,
                points: true,
                homeGols: true,
                awayGols: true,
                game: {
                  select: {
                    gameNumber: true,
                    home: { select: { name: true } },
                    away: { select: { name: true } },
                  },
                },
              },
              orderBy: { game: { gameNumber: "asc" } },
            },
          },
          orderBy: { points: "desc" },
        },
      },
    });
    return new GameDayDTO.Complete({
      id: model.id,
      round: model.round,
      liga: {
        id: model.liga.id,
        name: model.liga.name,
      },
      games: model.games.map((g) => {
        return {
          id: g.id,
          gameNumber: g.gameNumber,
          home: g.home.name,
          away: g.away.name,
          homeGols: g.homeGols,
          awayGols: g.awayGols,
        };
      }),
      bets: model.bets.map((b) => {
        return {
          id: b.id,
          better: {
            id: b.better.id,
            name: b.better.name,
          },
          points: b.points,
          scores: b.betScores.map((s) => {
            return {
              id: s.id,
              gameNumber: s.game.gameNumber,
              points: s.points,
              home: s.game.home.name,
              away: s.game.away.name,
              homeGols: s.homeGols,
              awayGols: s.awayGols,
            };
          }),
        };
      }),
    });
  }

  async listByLiga(ligaId: string): Promise<GameDayDTO.ListByLiga[]> {
    const models = await prisma.gameDayModel.findMany({
      where: { ligaId },
      select: {
        id: true,
        round: true,
        ligaId: true,
        games: {
          select: {
            id: true,
            gameNumber: true,
            home: { select: { id: true, name: true } },
            away: { select: { id: true, name: true } },
          },
          orderBy: { gameNumber: "asc" },
        },
      },
      orderBy: { round: "desc" },
    });

    return models.map((model) => {
      return new GameDayDTO.ListByLiga({
        id: model.id,
        round: model.round,
        ligaId: model.ligaId,
        games: model.games,
      });
    });
  }
}

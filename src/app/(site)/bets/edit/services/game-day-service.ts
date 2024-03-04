import { GetGameDayUseCase } from "@/backend/game-day/application/use-cases/get-game-day.use-case";
import { ListGameDaysByLiga } from "@/backend/game-day/application/use-cases/list-game-days-by-liga.use-case";
import { GameDayPrismaDAO } from "@/backend/game-day/query/game-day-prisma.dao";

export class GameDayService {
  private gameDayDAO: GameDayPrismaDAO;

  constructor() {
    this.gameDayDAO = new GameDayPrismaDAO();
  }

  async listGameDaysByLiga(ligaId?: string) {
    if (ligaId === undefined) {
      return;
    }
    const listGameDayByLiga = new ListGameDaysByLiga(this.gameDayDAO);
    const output = await listGameDayByLiga.execute({ ligaId });
    return output.map((gameDay) => gameDay.toJSON());
  }

  async getGameDayById(gameDayId?: string) {
    if (gameDayId === undefined) {
      return;
    }
    const getGameUseCase = new GetGameDayUseCase(this.gameDayDAO);
    return await getGameUseCase.execute({ id: gameDayId });
  }
}

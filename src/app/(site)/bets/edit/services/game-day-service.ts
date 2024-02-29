import { ListGameDaysByLiga } from "@/backend/game-day/application/use-cases/list-game-days-by-liga.use-case";
import { GameDayPrismaDAO } from "@/backend/game-day/query/game-day-prisma.dao";

export class GameDayService {
  private gameDayDAO: GameDayPrismaDAO;
  private listGameDayByLiga: ListGameDaysByLiga;

  constructor() {
    this.gameDayDAO = new GameDayPrismaDAO();
    this.listGameDayByLiga = new ListGameDaysByLiga(this.gameDayDAO);
  }

  async getGameDaysByLiga(ligaId: string) {
    const output = await this.listGameDayByLiga.execute({ ligaId });
    return output.map((gameDay) => gameDay.toJSON());
  }
}

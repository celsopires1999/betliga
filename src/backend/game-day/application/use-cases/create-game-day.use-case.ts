import { ILigaRepository } from "@/backend/liga/domain/repository/liga.repository";
import { ITeamRepository } from "@/backend/team/domain/repository/team.repository";
import { GameDay } from "../../domain/entities/game-day";
import { IGameDayRepository } from "../../domain/repository/game-day.repository";

export class CreateGameDayUseCase {
  constructor(
    private ligaRepo: ILigaRepository,
    private teamRepo: ITeamRepository,
    private gameDayRepo: IGameDayRepository
  ) {}

  async execute(input: CreateGameDayInput): Promise<CreateGameDayOutput> {
    const liga = await this.ligaRepo.findByName(input.liga.name);

    let games: GameProps[] = [];

    for (const game of input.games) {
      const home = await this.teamRepo.findByName(game.home);
      const away = await this.teamRepo.findByName(game.away);
      games.push({
        gameNumber: game.gameNumber,
        homeId: home.id,
        awayId: away.id,
      });
    }

    const gameDay = GameDay.create({
      ligaId: liga.id,
      round: input.round,
      games,
    });

    await this.gameDayRepo.insert(gameDay);

    return {
      id: gameDay.id,
    };
  }
}

export type CreateGameDayInput = {
  liga: {
    name: string;
  };
  round: number;
  games: {
    gameNumber: number;
    home: string;
    away: string;
  }[];
};

type GameProps = {
  gameNumber: number;
  homeId: string;
  awayId: string;
};

export type CreateGameDayOutput = {
  id: string;
};

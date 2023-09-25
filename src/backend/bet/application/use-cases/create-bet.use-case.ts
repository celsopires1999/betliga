import { ILigaRepository } from "@/backend/liga/domain/repository/liga.repository";
import { IBetRepository } from "../../domain/repository/bet.repository";
import { IGameDayRepository } from "@/backend/game-day/domain/repository/game-day.repository";
import { IBetterRepository } from "@/backend/better/domain/repository/better.repository";
import { Bet } from "../../domain/entities/bet";

export class CreateBetUseCase {
  constructor(
    private ligaRepo: ILigaRepository,
    private betterRepo: IBetterRepository,
    private gameDayRepo: IGameDayRepository,
    private betRepo: IBetRepository
  ) {}

  async execute(input: CreateBetInput): Promise<CreateBetOutput> {
    const liga = await this.ligaRepo.findByName(input.liga.name);
    const better = await this.betterRepo.findByName(input.better.name);
    const gameDay = await this.gameDayRepo.findByRound(
      liga.id,
      input.gameDay.round
    );

    const findGameId = (games: typeof gameDay.games, gameNumber: number) => {
      const game = games.find((g) => g.gameNumber === gameNumber);
      if (game) return game.id;
      throw new NotFoundError(
        `There is no ${gameNumber} game number in the given game day`
      );
    };

    const bet = Bet.create({
      betterId: better.id,
      gameDayId: gameDay.id,
      points: null,
      betScores: input.betScores.map((b) => {
        return {
          gameId: findGameId(gameDay.games, b.gameNumber),
          homeGols: b.homeGols,
          awayGols: b.awayGols,
        };
      }),
    });

    await this.betRepo.insert(bet);

    return {
      id: bet.id,
    };
  }
}

export type CreateBetInput = {
  liga: {
    name: string;
  };
  better: {
    name: string;
  };
  gameDay: {
    round: number;
  };
  betScores: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

export type CreateBetOutput = {
  id: string;
};

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

import { IGameDayRepository } from "@/backend/game-day/domain/repository/game-day.repository";
import { IBetRepository } from "../../domain/repository/bet.repository";

export class CalculateBetsPointsUseCase {
  constructor(
    private gameDayRepo: IGameDayRepository,
    private betRepo: IBetRepository
  ) {}

  async execute(
    input: CalculateBetsPointsInput
  ): Promise<CalculateBetsPointsOutput> {
    const gameDay = await this.gameDayRepo.findById(input.gameDayId);
    const bets = await this.betRepo.search({ gameDayId: input.gameDayId });

    for (const bet of bets) {
      bet.calculatePoints(gameDay.games);
      await this.betRepo.update(bet);
    }
  }
}

type CalculateBetsPointsInput = {
  gameDayId: string;
};

type CalculateBetsPointsOutput = void;

import { IGameDayRepository } from "../../domain/repository/game-day.repository";

export class UpdateGameDayResultsUseCase {
  constructor(private gameDayRepo: IGameDayRepository) {}

  async execute(
    input: UpdateGameDayResultInput
  ): Promise<UpdateGameDayResultOutput> {
    const gameDay = await this.gameDayRepo.findById(input.id);
    gameDay.updateScores(input.games);
    await this.gameDayRepo.update(gameDay);
  }
}

type UpdateGameDayResultInput = {
  id: string;
  games: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

type UpdateGameDayResultOutput = void;

import { IBetRepository } from "../../domain/repository/bet.repository";

export class UpdateBetUseCase {
  constructor(private betRepo: IBetRepository) {}

  async execute(input: UpdateBetInput): Promise<UpdateBetOutput> {
    const bet = await this.betRepo.findById(input.id);

    input.scores.forEach((score) => {
      const index = bet.betScores.findIndex(
        (betScore) => betScore.gameId === score.gameId
      );
      if (index === -1) {
        throw new Error(`gameId ${score.gameId} not found`);
      }
    });

    bet.changeScores(input.scores);

    await this.betRepo.update(bet);
  }
}

export type UpdateBetInput = {
  id: string;
  scores: {
    gameNumber: number;
    gameId: string;
    homeGols: number;
    awayGols: number;
  }[];
};

export type UpdateBetOutput = void;

import {
  UpdateBetInput,
  UpdateBetUseCase,
} from "@/backend/bet/application/use-cases/update-bet.use-case";
import { IBetRepository } from "@/backend/bet/domain/repository/bet.repository";
import { BetPrismaRepository } from "@/backend/bet/infra/db/prisma/bet-prisma.repository";

export class BetService {
  private betRepo: IBetRepository;
  constructor() {
    this.betRepo = new BetPrismaRepository();
  }

  updateBet(input: UpdateBetInput) {
    const updateBetUseCase = new UpdateBetUseCase(this.betRepo);
    return updateBetUseCase.execute(input);
  }
}

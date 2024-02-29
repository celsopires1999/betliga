import { ListBettersUseCase } from "@/backend/better/application/use-cases/list-betters.use-case";
import { BetterPrismaRepository } from "@/backend/better/infra/db/prisma/better-prisma.repository";

export class BetterService {
  private betterRepo: BetterPrismaRepository;
  private listBettersUseCase: ListBettersUseCase;
  constructor() {
    this.betterRepo = new BetterPrismaRepository();
    this.listBettersUseCase = new ListBettersUseCase(this.betterRepo);
  }

  async getBetters() {
    const output = await this.listBettersUseCase.execute();
    return output;
  }
}

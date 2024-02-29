import { ListLigasUseCase } from "@/backend/liga/application/use-cases/list-ligas.use-case";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";

export class LigaService {
  private ligaRepo: LigaPrismaRepository;
  private listLigasUseCase: ListLigasUseCase;
  constructor() {
    this.ligaRepo = new LigaPrismaRepository();
    this.listLigasUseCase = new ListLigasUseCase(this.ligaRepo);
  }

  async getLigas() {
    return await this.listLigasUseCase.execute();
  }
}

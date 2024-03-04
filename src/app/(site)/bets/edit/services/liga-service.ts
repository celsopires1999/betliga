import { ListLigasUseCase } from "@/backend/liga/application/use-cases/list-ligas.use-case";
import { ILigaRepository } from "@/backend/liga/domain/repository/liga.repository";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";

export class LigaService {
  private ligaRepo: ILigaRepository;
  constructor() {
    this.ligaRepo = new LigaPrismaRepository();
  }

  async getLigas() {
    const listLigasUseCase = new ListLigasUseCase(this.ligaRepo);
    return await listLigasUseCase.execute();
  }
}

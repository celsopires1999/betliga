import { Liga } from "../../domain/entities/liga";
import { ILigaRepository } from "../../domain/repository/liga.repository";

export class CreateLigasUseCase {
  constructor(private ligaRepo: ILigaRepository) {}

  async execute(input: CreateLigasInput): Promise<CreateLigasOutput> {
    const ligas = input.names.map((n) => Liga.create({ name: n }));
    await this.ligaRepo.bulkInsert(ligas);

    return ligas.map((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });
  }
}

type CreateLigasInput = { names: string[] };

type CreateLigasOutput = {
  id: string;
  name: string;
}[];

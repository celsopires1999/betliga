import { ILigaRepository } from "../../domain/repository/liga.repository";

export class ListLigasUseCase {
  constructor(private ligaRepo: ILigaRepository) {}
  async execute(input: ListLigasInput): Promise<ListLigasOutput> {
    const ligas = await this.ligaRepo.findAll();
    return ligas.map((l) => {
      return {
        id: l.id,
        name: l.name,
      };
    });
  }
}

export type ListLigasInput = void;

export type ListLigasOutput = {
  id: string;
  name: string;
}[];

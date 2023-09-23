import { ILigaRepository } from "../../domain/repository/liga.repository";

export class GetLigaUseCase {
  constructor(private ligaRepo: ILigaRepository) {}
  async execute(input: GetLigaInput): Promise<GetLigaOutput> {
    const liga = await this.ligaRepo.findById(input.id);
    return {
      id: liga.id,
      name: liga.name,
    };
  }
}

export type GetLigaInput = {
  id: string;
};

export type GetLigaOutput = {
  id: string;
  name: string;
};

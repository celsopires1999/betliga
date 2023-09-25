import { IBetterRepository } from "../../domain/repository/better.repository";

export class ListBettersUseCase {
  constructor(private betterRepo: IBetterRepository) {}

  async execute(_input: ListBettersInput): Promise<ListBetterOutput> {
    const betters = await this.betterRepo.findAll();

    return betters.map((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });
  }
}

export type ListBettersInput = void;
export type ListBetterOutput = {
  id: string;
  name: string;
}[];

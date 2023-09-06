import { Better } from "../../domain/entities/better";
import { IBetterRepository } from "../../domain/repository/better.repository";

export class CreateBettersUseCase {
  constructor(private betterRepo: IBetterRepository) {}

  async execute(input: CreateBettersInput): Promise<CreateBettersOutput> {
    const betters = input.names.map((n) => Better.create({ name: n }));
    await this.betterRepo.bulkInsert(betters);

    return betters.map((b) => {
      return {
        id: b.id,
        name: b.name,
      };
    });
  }
}

type CreateBettersInput = { names: string[] };

type CreateBettersOutput = {
  id: string;
  name: string;
}[];

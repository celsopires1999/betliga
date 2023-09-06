import { prisma } from "@/backend/@prisma/prisma";
import { LigaPrismaRepository } from "./liga-prisma.repository";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";

describe("LigaPrismaRepository Unit Test", () => {
  beforeEach(async () => {
    await initializePrisma();
    await prisma.ligaModel.create({
      data: { id: "1", name: "Bundesliga 2023/24" },
    });
  });
  it("should find a Liga", async () => {
    const repository = new LigaPrismaRepository();
    const liga = await repository.findById("1");
    expect(liga.id).toBe("1");
    expect(liga.name).toBe("Bundesliga 2023/24");
  });
});

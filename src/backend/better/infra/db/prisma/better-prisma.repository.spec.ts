import { prisma } from "@/backend/@prisma/prisma";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { BetterPrismaRepository } from "./better-prisma.repository";

describe("BetterPrismaRepository Unit Test", () => {
  beforeEach(async () => {
    await initializePrisma();
    await prisma.betterModel.createMany({
      data: [
        { id: "1", name: "Better 1" },
        { id: "2", name: "Better 2" },
      ],
    });
  });

  it("should find a Better", async () => {
    const repository = new BetterPrismaRepository();
    const better = await repository.findById("1");
    expect(better.id).toBe("1");
    expect(better.name).toBe("Better 1");
  });
});

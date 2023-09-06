import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { TeamPrismaRepository } from "./team-prisma.repository";
import { prisma } from "@/backend/@prisma/prisma";

describe("TeamPrismaRepository Unit Test", () => {
  beforeEach(async () => {
    await initializePrisma();
    await prisma.teamModel.createMany({
      data: [
        {
          id: "1",
          name: "Team 1",
        },
        {
          id: "2",
          name: "Team 2",
        },
        {
          id: "3",
          name: "Team 3",
        },
        {
          id: "4",
          name: "Team 4",
        },
      ],
    });
  });
  it("should find a Team", async () => {
    const repository = new TeamPrismaRepository();
    const liga = await repository.findById("1");
    expect(liga.id).toBe("1");
    expect(liga.name).toBe("Team 1");
  });
});

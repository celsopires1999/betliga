import { prisma } from "@/backend/@prisma/prisma";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { ResultPrismaRepository } from "./result-prisma.repository";

describe.skip("ResultPrismaRepository Unit Test", () => {
  beforeEach(async () => {
    await initializePrisma();
    await prisma.$transaction([
      prisma.ligaModel.create({
        data: {
          id: "1",
          name: "Bundesliga 2023/24",
        },
      }),
      prisma.teamModel.createMany({
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
      }),
      prisma.gameDayModel.create({
        data: {
          id: "1",
          round: 1,
          ligaId: "1",
        },
      }),
      prisma.gameModel.createMany({
        data: [
          {
            id: "1",
            gameDayId: "1",
            gameNumber: 1,
            homeId: "1",
            awayId: "2",
          },
          {
            id: "2",
            gameDayId: "1",
            gameNumber: 2,
            homeId: "3",
            awayId: "4",
          },
        ],
      }),
    ]);
  }, 10000);

  it("should find a Result", async () => {
    await prisma.$transaction([
      prisma.resultModel.create({
        data: {
          id: "1",
          gameDayId: "1",
        },
      }),
      prisma.resultScoreModel.create({
        data: {
          id: "1",
          resultId: "1",
          gameId: "1",
          homeGols: 1,
          awayGols: 2,
        },
      }),
    ]);

    const repository = new ResultPrismaRepository();
    const result = await repository.findById("1");
    expect(result.id).toBe("1");
    expect(result.gameDayId).toBe("1");
    expect(result.resultScores.length).toBe(1);
    expect(result.resultScores[0].homeGols).toBe(1);
    expect(result.resultScores[0].awayGols).toBe(2);
  });

  it("should return Result", async () => {
    await prisma.$transaction([
      prisma.resultModel.create({
        data: {
          id: "1",
          gameDayId: "1",
        },
      }),
      prisma.resultScoreModel.create({
        data: {
          id: "1",
          resultId: "1",
          gameId: "1",
          homeGols: 1,
          awayGols: 2,
        },
      }),
    ]);

    const repository = new ResultPrismaRepository();
    const result = await repository.search({ gameDayId: "1" });
    expect(result.id).toBe("1");
    expect(result.gameDayId).toBe("1");
    expect(result.resultScores[0].homeGols).toBe(1);
    expect(result.resultScores[0].awayGols).toBe(2);
  });
});

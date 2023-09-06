import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { BetPrismaRepository } from "./bet-prisma.repository";
import { prisma } from "@/backend/@prisma/prisma";

describe("BetPrismaRepository Unit Test", () => {
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
      prisma.betterModel.create({
        data: {
          id: "1",
          name: "Better 1",
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
      prisma.gameDayModel.create({
        data: {
          id: "1",
          round: 1,
          ligaId: "1",
        },
      }),
    ]);
  }, 10000);
  it("should find a Bet", async () => {
    await prisma.$transaction([
      prisma.betModel.create({
        data: {
          id: "1",
          betterId: "1",
          gameDayId: "1",
        },
      }),
      prisma.betScoreModel.create({
        data: {
          id: "1",
          gameId: "1",
          betId: "1",
          homeGols: 1,
          awayGols: 2,
          column: "2",
        },
      }),
    ]);

    const repository = new BetPrismaRepository();
    const bet = await repository.findById("1");
    expect(bet.id).toBe("1");
    expect(bet.betterId).toBe("1");
    expect(bet.gameDayId).toBe("1");
    expect(bet.betScores.length).toBe(1);
    expect(bet.betScores[0].homeGols).toBe(1);
    expect(bet.betScores[0].awayGols).toBe(2);
  });

  it("should search Bet", async () => {
    await prisma.$transaction([
      prisma.betModel.create({
        data: {
          id: "1",
          betterId: "1",
          gameDayId: "1",
        },
      }),
      prisma.betScoreModel.create({
        data: {
          id: "1",
          gameId: "1",
          betId: "1",
          homeGols: 1,
          awayGols: 2,
          column: "2",
        },
      }),
    ]);

    const repository = new BetPrismaRepository();
    const bets = await repository.search({ gameDayId: "1" });
    expect(bets.length).toBe(1);
  });
});

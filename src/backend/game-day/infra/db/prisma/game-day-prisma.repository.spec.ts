import { prisma } from "@/backend/@prisma/prisma";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { GameDayPrismaRepository } from "./game-day-prisma.repository";

describe("GameDayPrismaRepository Unit Test", () => {
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
    ]);
  }, 10000);

  it("should find a GameDay", async () => {
    await prisma.$transaction([
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

    const repository = new GameDayPrismaRepository();
    let gameDay = await repository.findById("1");
    expect(gameDay.id).toBe("1");
    expect(gameDay.ligaId).toBe("1");
    expect(gameDay.round).toBe(1);
    expect(gameDay.games.length).toBe(2);
  });

  it("should update a score", async () => {
    await prisma.$transaction(async (prisma) => {
      await prisma.gameDayModel.create({
        data: {
          id: "1",
          round: 1,
          ligaId: "1",
        },
      });
      await prisma.gameModel.createMany({
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
          {
            id: "3",
            gameDayId: "1",
            gameNumber: 3,
            homeId: "777",
            awayId: "4",
          },
        ],
      });
    });

    const repository = new GameDayPrismaRepository();
    let gameDay = await repository.findById("1");
    gameDay.games[0].updateScore(1, 1);
    gameDay.games[1].updateScore(2, 1);
    gameDay.games[2].updateScore(1, 2);
    await repository.update(gameDay);
    gameDay = await repository.findById("1");
    expect(gameDay.games[0].column).toBe("X");
    expect(gameDay.games[1].column).toBe("1");
    expect(gameDay.games[2].column).toBe("2");
  });
});

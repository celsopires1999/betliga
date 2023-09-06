import { prisma } from "@/backend/@prisma/prisma";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { GameDayPrismaDAO } from "./game-day-prisma.dao";

describe("GameDayPrismaDAO Test", () => {
  const liga = {
    id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
    name: "Bundesliga 2023/24",
  };
  const betters = [
    {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      name: "Better 1",
    },
    {
      id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
      name: "Better 2",
    },
  ];
  const teams = [
    {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      name: "Team 1",
    },
    {
      id: "8033b29f-f6ac-4e5d-96c6-85759b509104",
      name: "Team 2",
    },
  ];
  const gameDay = {
    id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
    ligaId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
    round: 1,
  };
  const games = [
    {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      gameDayId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      gameNumber: 1,
      homeId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      awayId: "8033b29f-f6ac-4e5d-96c6-85759b509104",
      homeGols: 1,
      awayGols: 1,
      column: "X",
    },
  ];
  const bets = [
    {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      betterId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      gameDayId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      points: 0,
    },
    {
      id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
      betterId: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
      gameDayId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      points: 10,
    },
  ];
  const betScores = [
    {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      betId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      homeGols: 2,
      awayGols: 1,
      column: "1",
      gameId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      points: 0,
    },
    {
      id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
      betId: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
      homeGols: 1,
      awayGols: 1,
      column: "X",
      gameId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      points: 10,
    },
  ];

  beforeEach(async () => {
    await initializePrisma();
    await prisma.$transaction([
      prisma.ligaModel.create({ data: liga }),
      prisma.betterModel.createMany({ data: betters }),
      prisma.teamModel.createMany({ data: teams }),
      prisma.gameDayModel.create({ data: gameDay }),
      prisma.gameModel.createMany({ data: games }),
      prisma.betModel.createMany({ data: bets }),
      prisma.betScoreModel.createMany({ data: betScores }),
    ]);
  });

  it("should get a game day", async () => {
    const expectedResult = {
      id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
      round: 1,
      liga: {
        id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
        name: "Bundesliga 2023/24",
      },
      games: [
        {
          id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
          gameNumber: 1,
          home: "Team 1",
          away: "Team 2",
          homeGols: 1,
          awayGols: 1,
        },
      ],
      bets: [
        {
          id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
          better: {
            id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
            name: "Better 2",
          },
          points: 10,
          scores: [
            {
              id: "cd7c2de4-514e-4677-a580-5c5b23b640f5",
              gameNumber: 1,
              points: 10,
              home: "Team 1",
              away: "Team 2",
              homeGols: 1,
              awayGols: 1,
            },
          ],
        },
        {
          id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
          better: {
            id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
            name: "Better 1",
          },
          points: 0,
          scores: [
            {
              id: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
              gameNumber: 1,
              points: 0,
              home: "Team 1",
              away: "Team 2",
              homeGols: 2,
              awayGols: 1,
            },
          ],
        },
      ],
    };
    const gameDay = new GameDayPrismaDAO();
    const result = await gameDay.findCompleteById(
      "40fe3dc2-dd1c-4769-85e1-b7efabc2d817"
    );
    expect(result).toEqual(expectedResult);
  });
});

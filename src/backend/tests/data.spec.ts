import { prisma } from "../@prisma/prisma";

describe("Name of the group", () => {
  test.skip("create test data ", async () => {
    await prisma.ligaModel.deleteMany();
    await prisma.betterModel.deleteMany();
    await prisma.teamModel.deleteMany();
    await prisma.gameDayModel.deleteMany();
    await prisma.betModel.deleteMany();
    await prisma.resultModel.deleteMany();

    await prisma.ligaModel.createMany({ data: ligaData });
    await prisma.betterModel.createMany({ data: betterData });
    await prisma.teamModel.createMany({ data: teamData });
    await prisma.gameDayModel.createMany({ data: gameDayData });
    await prisma.betModel.createMany({ data: betData });
    await prisma.resultModel.createMany({ data: resultData });
  });
});

export const ligaData = [{ id: "0", name: "Bundesliga 2023/24" }];

export const betterData = [
  { id: "0", name: "Better 1" },
  { id: "1", name: "Better 2" },
];

export const teamData = [
  { id: "0", name: "Team 1" },
  { id: "1", name: "Team 2" },
  { id: "2", name: "Team 3" },
  { id: "3", name: "Team 4" },
];

export const gameDayData = [
  {
    id: "0",
    ligaId: "0",
    round: 1,
    games: [
      { gameNumber: 1, homeId: "0", awayId: "1" },
      { gameNumber: 2, homeId: "2", awayId: "3" },
    ],
  },
];

export const betData = [
  {
    id: "0",
    gameDayId: "0",
    betterId: "0",
    scores: [
      { gameNumber: 1, homeGols: 1, awayGols: 1 },
      { gameNumber: 2, homeGols: 1, awayGols: 1 },
    ],
  },
  {
    id: "1",
    gameDayId: "0",
    betterId: "1",
    scores: [
      { gameNumber: 1, homeGols: 2, awayGols: 1 },
      { gameNumber: 2, homeGols: 1, awayGols: 2 },
    ],
  },
];

export const resultData = [
  {
    id: "0",
    gameDayId: "0",
    scores: [
      { gameNumber: 1, homeGols: 2, awayGols: 1 },
      { gameNumber: 2, homeGols: 1, awayGols: 2 },
    ],
  },
];

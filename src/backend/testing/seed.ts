import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

  {
    id: "726f9ff8-1645-40f6-967e-a8a967ece247",
    name: "Team 3",
  },
  {
    id: "6652fb7d-328f-4584-9a1e-cf47c47d04aa",
    name: "Team 4",
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
  {
    id: "026d4100-21e8-4eea-806e-dfb8b6e36598",
    gameDayId: "40fe3dc2-dd1c-4769-85e1-b7efabc2d817",
    gameNumber: 2,
    homeId: "726f9ff8-1645-40f6-967e-a8a967ece247",
    awayId: "6652fb7d-328f-4584-9a1e-cf47c47d04aa",
    homeGols: 2,
    awayGols: 1,
    column: "1",
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

async function main() {
  await prisma.$transaction([
    prisma.betScoreModel.deleteMany(),
    prisma.betModel.deleteMany(),
    prisma.gameModel.deleteMany(),
    prisma.gameDayModel.deleteMany(),
    prisma.ligaModel.deleteMany(),
    prisma.teamModel.deleteMany(),
    prisma.betterModel.deleteMany(),
  ]);

  await prisma.$transaction([
    prisma.ligaModel.create({ data: liga }),
    prisma.betterModel.createMany({ data: betters }),
    prisma.teamModel.createMany({ data: teams }),
    prisma.gameDayModel.create({ data: gameDay }),
    prisma.gameModel.createMany({ data: games }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

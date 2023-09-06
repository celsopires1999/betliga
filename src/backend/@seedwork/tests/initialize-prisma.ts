import { prisma } from "@/backend/@prisma/prisma";

export async function initializePrisma() {
  await prisma.$transaction([
    prisma.betScoreModel.deleteMany(),
    prisma.betModel.deleteMany(),
    prisma.gameModel.deleteMany(),
    prisma.gameDayModel.deleteMany(),
    prisma.ligaModel.deleteMany(),
    prisma.teamModel.deleteMany(),
    prisma.betterModel.deleteMany(),
  ]);
}

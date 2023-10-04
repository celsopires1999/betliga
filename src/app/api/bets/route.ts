import { CreateBetUseCase } from "@/backend/bet/application/use-cases/create-bet.use-case";
import { BetPrismaRepository } from "@/backend/bet/infra/db/prisma/bet-prisma.repository";
import { BetterPrismaRepository } from "@/backend/better/infra/db/prisma/better-prisma.repository";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthentication } from "../auth/[...nextauth]/helper";

type Input = {
  liga: {
    name: string;
  };
  better: {
    name: string;
  };
  gameDay: {
    round: number;
  };
  betScores: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const response = await checkAuthentication();
  if (response) return response;

  const ligaRepo = new LigaPrismaRepository();
  const betterRepo = new BetterPrismaRepository();
  const gameDayRepo = new GameDayPrismaRepository();
  const betRepo = new BetPrismaRepository();

  const useCase = new CreateBetUseCase(
    ligaRepo,
    betterRepo,
    gameDayRepo,
    betRepo
  );

  const output = await useCase.execute(input);

  return NextResponse.json({ id: output.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  console.log(request);

  return NextResponse.json({ message: "OK" });
}

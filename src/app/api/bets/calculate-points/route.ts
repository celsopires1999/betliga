import { CalculateBetsPointsUseCase } from "@/backend/bet/application/use-cases/calculate-bets-points.use-case";
import { BetPrismaRepository } from "@/backend/bet/infra/db/prisma/bet-prisma.repository";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  gameDayId: string;
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const gameDayRepo = new GameDayPrismaRepository();
  const betRepo = new BetPrismaRepository();

  const useCase = new CalculateBetsPointsUseCase(gameDayRepo, betRepo);

  await useCase.execute(input);

  return NextResponse.json(
    { message: "Bets points calculated" },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  console.log(request);

  return NextResponse.json({ message: "OK" });
}

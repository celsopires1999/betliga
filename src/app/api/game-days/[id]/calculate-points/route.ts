import { CalculateBetsPointsUseCase } from "@/backend/bet/application/use-cases/calculate-bets-points.use-case";
import { BetPrismaRepository } from "@/backend/bet/infra/db/prisma/bet-prisma.repository";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const gameDayRepo = new GameDayPrismaRepository();
  const betRepo = new BetPrismaRepository();

  const useCase = new CalculateBetsPointsUseCase(gameDayRepo, betRepo);

  await useCase.execute({ gameDayId: params.id });

  return NextResponse.json(
    { message: "Bets points calculated" },
    { status: 200 }
  );
}

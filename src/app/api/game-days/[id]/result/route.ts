import { checkAuthentication } from "@/app/api/auth/[...nextauth]/helper";
import { UpdateGameDayResultsUseCase } from "@/backend/game-day/application/use-cases/update-game-day-results.use-case";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  games: {
    gameNumber: number;
    homeGols: number;
    awayGols: number;
  }[];
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const input: Input = { ...(await request.json()) };

  const response = await checkAuthentication(request);
  if (response) return response;

  const gameDayRepo = new GameDayPrismaRepository();
  const useCase = new UpdateGameDayResultsUseCase(gameDayRepo);
  await useCase.execute({ id: params.id, games: input.games });

  return NextResponse.json({ status: 200 });
}

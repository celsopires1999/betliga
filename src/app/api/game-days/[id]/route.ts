import { GetGameDayUseCase } from "@/backend/game-day/application/use-cases/get-game-day.use-case";
import { UpdateGameDayResultsUseCase } from "@/backend/game-day/application/use-cases/update-game-day-results.use-case";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { GameDayPrismaDAO } from "@/backend/game-day/query/game-day-prisma.dao";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const gameDayDAO = new GameDayPrismaDAO();
  const useCase = new GetGameDayUseCase(gameDayDAO);

  const output = await useCase.execute({ id: params.id });

  return NextResponse.json(output, { status: 200 });
}

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

  const gameDayRepo = new GameDayPrismaRepository();
  const useCase = new UpdateGameDayResultsUseCase(gameDayRepo);
  await useCase.execute({ id: params.id, games: input.games });

  return NextResponse.json({ status: 200 });
}

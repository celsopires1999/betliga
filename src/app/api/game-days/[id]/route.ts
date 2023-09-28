import { GetGameDayUseCase } from "@/backend/game-day/application/use-cases/get-game-day.use-case";
import { GameDayPrismaDAO } from "@/backend/game-day/query/game-day-prisma.dao";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const gameDayDAO = new GameDayPrismaDAO();
  const useCase = new GetGameDayUseCase(gameDayDAO);

  const output = await useCase.execute({ id: params.id });

  return NextResponse.json(output, { status: 200 });
}

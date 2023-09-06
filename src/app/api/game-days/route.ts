import { CreateGameDayUseCase } from "@/backend/game-day/application/use-cases/create-game-day.use-case";
import { GameDayPrismaRepository } from "@/backend/game-day/infra/db/prisma/game-day-prisma.repository";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { TeamPrismaRepository } from "@/backend/team/infra/db/prisma/team-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

export type Input = {
  liga: {
    name: string;
  };
  round: number;
  games: {
    gameNumber: number;
    home: string;
    away: string;
  }[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const ligaRepo = new LigaPrismaRepository();
  const teamRepo = new TeamPrismaRepository();
  const gameDayRepo = new GameDayPrismaRepository();

  const useCase = new CreateGameDayUseCase(ligaRepo, teamRepo, gameDayRepo);

  const output = await useCase.execute(input);

  return NextResponse.json({ id: output.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  console.log(request);

  return NextResponse.json({ message: "OK" });
}
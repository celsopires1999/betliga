import { CreateTeamsUseCase } from "@/backend/team/application/use-cases/create-teams.use-case";
import { TeamPrismaRepository } from "@/backend/team/infra/db/prisma/team-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  names: string[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const teamRepo = new TeamPrismaRepository();
  const useCase = new CreateTeamsUseCase(teamRepo);

  const output = await useCase.execute(input);

  return NextResponse.json(output, { status: 201 });
}

export async function GET(request: NextRequest) {
  console.log(request);

  return NextResponse.json({ message: "OK" });
}

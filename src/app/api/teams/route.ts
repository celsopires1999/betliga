import { CreateTeamsUseCase } from "@/backend/team/application/use-cases/create-teams.use-case";
import { ListTeamsUseCase } from "@/backend/team/application/use-cases/list-teams-use.case";
import { TeamPrismaRepository } from "@/backend/team/infra/db/prisma/team-prisma.repository";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthentication } from "../auth/[...nextauth]/helper";

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
  const response = await checkAuthentication(request);
  if (response) return response;

  const teamRepo = new TeamPrismaRepository();
  const useCase = new ListTeamsUseCase(teamRepo);

  const output = await useCase.execute();

  return NextResponse.json(output, { status: 200 });
}

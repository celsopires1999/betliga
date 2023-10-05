import { CreateLigasUseCase } from "@/backend/liga/application/use-cases/create-ligas.use-case";
import { ListLigasUseCase } from "@/backend/liga/application/use-cases/list-ligas.use-case";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthentication } from "../auth/[...nextauth]/helper";

type Input = {
  names: string[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const ligaRepo = new LigaPrismaRepository();
  const useCase = new CreateLigasUseCase(ligaRepo);

  const output = await useCase.execute(input);

  return NextResponse.json(output, { status: 201 });
}

export async function GET(request: NextRequest) {
  const response = await checkAuthentication(request);
  if (response) return response;

  const ligaRepo = new LigaPrismaRepository();
  const useCase = new ListLigasUseCase(ligaRepo);

  const output = await useCase.execute();

  return NextResponse.json(output, { status: 200 });
}

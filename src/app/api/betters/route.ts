import { CreateBettersUseCase } from "@/backend/better/application/use-cases/create-betters.use-case";
import { ListBettersUseCase } from "@/backend/better/application/use-cases/list-betters.use-case";
import { BetterPrismaRepository } from "@/backend/better/infra/db/prisma/better-prisma.repository";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthentication } from "../auth/[...nextauth]/helper";

type Input = {
  names: string[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };
  const response = await checkAuthentication(request);
  if (response) return response;

  const betterRepo = new BetterPrismaRepository();
  const useCase = new CreateBettersUseCase(betterRepo);

  const output = await useCase.execute(input);

  return NextResponse.json(output, { status: 201 });
}

export async function GET(_request: NextRequest) {
  const betterRepo = new BetterPrismaRepository();
  const useCase = new ListBettersUseCase(betterRepo);

  const output = await useCase.execute();

  return NextResponse.json(output, { status: 200 });
}

import { CreateBettersUseCase } from "@/backend/better/application/use-cases/create-betters.use-case";
import { BetterPrismaRepository } from "@/backend/better/infra/db/prisma/better-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  names: string[];
};

export async function POST(request: NextRequest) {
  const input: Input = { ...(await request.json()) };

  const betterRepo = new BetterPrismaRepository();
  const useCase = new CreateBettersUseCase(betterRepo);

  const output = await useCase.execute(input);

  return NextResponse.json(output, { status: 201 });
}

export async function GET(request: NextRequest) {
  console.log(request);

  return NextResponse.json({ message: "OK" });
}

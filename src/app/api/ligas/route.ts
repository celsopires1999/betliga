import { CreateLigasUseCase } from "@/backend/liga/application/use-cases/create-ligas.use-case";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { NextRequest, NextResponse } from "next/server";

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
  console.log(request);

  return NextResponse.json({ message: "OK" });
}

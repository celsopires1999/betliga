import { GetLigaUseCase } from "@/backend/liga/application/use-cases/get-liga.use-case";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ligaRepo = new LigaPrismaRepository();
  const useCase = new GetLigaUseCase(ligaRepo);
  const output = await useCase.execute({ id: params.id });
  return NextResponse.json(output, { status: 200 });
}

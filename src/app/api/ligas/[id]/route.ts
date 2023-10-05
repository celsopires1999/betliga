import { GetLigaUseCase } from "@/backend/liga/application/use-cases/get-liga.use-case";
import { LigaPrismaRepository } from "@/backend/liga/infra/db/prisma/liga-prisma.repository";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthentication } from "../../auth/[...nextauth]/helper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await checkAuthentication(request);
  if (response) return response;

  const ligaRepo = new LigaPrismaRepository();
  const useCase = new GetLigaUseCase(ligaRepo);
  const output = await useCase.execute({ id: params.id });
  return NextResponse.json(output, { status: 200 });
}

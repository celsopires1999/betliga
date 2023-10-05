import { LoginUseCase } from "@/backend/user/application/use-cases/login-use.case";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  const useCase = new LoginUseCase();
  const user = await useCase.execute(body);

  if (user) {
    return NextResponse.json(user, { status: 200 });
  }

  return NextResponse.json(
    { success: false, message: "unauthenticated" },
    { status: 401 }
  );
}

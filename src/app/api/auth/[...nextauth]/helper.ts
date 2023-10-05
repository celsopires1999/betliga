import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./options";
import { Token } from "@/backend/user/infra/token/token";

export async function checkAuthentication(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const accessToken = request?.headers.get("Authorization");
    if (accessToken) {
      const token = new Token();
      if (token.verifyJwt(accessToken)) {
        return;
      }
    }
    return NextResponse.json(
      { success: false, message: "unauthenticated" },
      { status: 401 }
    );
  }
}

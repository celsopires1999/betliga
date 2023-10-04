import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./options";

export async function checkAuthentication() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "unauthenticated" },
      { status: 401 }
    );
  }
}

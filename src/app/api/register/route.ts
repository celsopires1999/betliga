import { prisma } from "@/backend/@prisma/prisma";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  try {
    const user = await prisma.userModel.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json(
        { message: "email is already registered", code: 12 },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred on checking email" },
      { status: 500 }
    );
  }

  try {
    const hashedPassword = await hash(password, 12);
    await prisma.userModel.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { message: "User registered", code: 0 },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred on user registration" },
      { status: 500 }
    );
  }
}

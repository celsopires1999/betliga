import { prisma } from "@/backend/@prisma/prisma";
import { compare } from "bcrypt";
import { Token } from "../../infra/token/token";

export class LoginUseCase {
  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput | null> {
    const user = await prisma.userModel.findUnique({
      where: { email: input.email },
    });

    if (user && (await compare(input.password, user.password))) {
      const { password, createdAt, updatedAt, ...userWithoutPass } = user;
      const token = new Token();
      const accessToken = token.signJwtAccessToken(userWithoutPass);
      const result = {
        ...userWithoutPass,
        accessToken,
      };
      return result;
    }
    return null;
  }
}

type LoginUseCaseInput = {
  email: string;
  password: string;
};

type LoginUseCaseOutput = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
};

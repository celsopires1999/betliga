import jwt, { type JwtPayload } from "jsonwebtoken";

type SignOption = {
  expiresIn?: string | number;
};
const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};
export class Token {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.NEXTAUTH_SECRET!;
  }

  signJwtAccessToken(
    payload: JwtPayload,
    options: SignOption = DEFAULT_SIGN_OPTION
  ) {
    const token = jwt.sign(payload, this.secretKey, options);
    return token;
  }

  verifyJwt(token: string) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}

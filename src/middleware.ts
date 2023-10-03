export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/game-days/:path*", "/bets/:path*"],
};

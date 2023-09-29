import { Team } from "./Team";

export type Game = {
  id: string;
  gameNumber: number;
  home: Team;
  away: Team;
};

import { Game } from "./Game";
import { Liga } from "./Liga";

export type GameDay = {
  id: string;
  ligaId: string;
  liga: Liga;
  round: number;
  games: Game[];
};

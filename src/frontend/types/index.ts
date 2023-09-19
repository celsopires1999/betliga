export type Game = {
  gameNumber?: number | null;
  home?: Team | null;
  away?: Team | null;
};

export type Team = {
  id?: string | null;
  name?: string | null;
};

export type Liga = {
  id?: string | null;
  name?: string | null;
};

export type GameDay = {
  liga?: Liga | null;
  round?: number | null;
  games?: Game[] | null;
};

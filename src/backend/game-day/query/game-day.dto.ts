export namespace GameDayDTO {
  type CompleteProps = {
    id: string;
    round: number;
    liga: {
      id: string;
      name: string;
    };
    games: {
      id: string;
      gameNumber: number;
      home: string;
      away: string;
      homeGols: number | null;
      awayGols: number | null;
    }[];
    bets: {
      id: string;
      better: {
        id: string;
        name: string;
      };
      points: number | null;
      scores: {
        id: string;
        gameNumber: number;
        points: number | null;
        home: string;
        away: string;
        homeGols: number;
        awayGols: number;
      }[];
    }[];
  };

  export class Complete {
    constructor(public props: CompleteProps) {}
    toJSON() {
      return {
        ...this.props,
      };
    }
  }

  type ListByLigaProps = {
    id: string;
    round: number;
    ligaId: string;
    games: {
      id: string;
      gameNumber: number;
      homeGols: number | null;
      awayGols: number | null;
      home: {
        id: string;
        name: string;
      };
      away: {
        id: string;
        name: string;
      };
    }[];
  };

  export class ListByLiga {
    constructor(public props: ListByLigaProps) {}
    toJSON() {
      return {
        ...this.props,
      };
    }
  }
}

import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { GameCard } from "./GameCard";

type GamesCardsProps = {
  scores: {
    id: string;
    gameNumber: number;
    points: number | null;
    home: string;
    away: string;
    homeGols: number;
    awayGols: number;
  }[];
  games: {
    id: string;
    gameNumber: number;
    home: string;
    away: string;
    homeGols: number | null;
    awayGols: number | null;
  }[];
};
export function GamesCards({ scores, games }: GamesCardsProps) {
  return (
    <>
      {scores.map((score) => {
        const game = games.find((g) => g.gameNumber === score.gameNumber);
        return (
          <Grid key={score.id} xs={12} sm={6} lg={4} xl={2}>
            <GameCard
              gameNumber={score.gameNumber}
              points={score.points}
              home={score.home}
              away={score.away}
              betHomeGols={score.homeGols}
              betAwayGols={score.awayGols}
              resultHomeGols={game?.homeGols}
              resultAwayGols={game?.awayGols}
            />
          </Grid>
        );
      })}
    </>
  );
}

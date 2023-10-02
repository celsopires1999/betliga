import { Card, CardContent, Typography } from "@mui/material";

type GameCardProps = {
  gameNumber: number;
  points: number | null;
  home: string;
  away: string;
  betHomeGols: number;
  betAwayGols: number;
  resultHomeGols?: number | null;
  resultAwayGols?: number | null;
};

export function GameCard({
  gameNumber,
  points,
  home,
  away,
  betHomeGols,
  betAwayGols,
  resultHomeGols,
  resultAwayGols,
}: GameCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ mb: 1 }} variant="h6" component="div">
          {`Game #${gameNumber}`}
        </Typography>
        <Typography sx={{ mb: 1 }} variant="body1">
          {home}
          <br />
          {away}
        </Typography>
        <Typography sx={{ mb: 1 }} variant="body1">
          Bet {betHomeGols}-{betAwayGols}
          {resultHomeGols !== null
            ? ` / Result ${resultHomeGols}-${resultAwayGols}`
            : " / Result (not available)"}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }} variant="body1">
          {points !== null ? `${points} Points` : `OPEN`}
        </Typography>
      </CardContent>
    </Card>
  );
}

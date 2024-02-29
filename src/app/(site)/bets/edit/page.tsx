"use server";
import { Box, Button, Input, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { BetterDaySelector } from "./BetterSelector";
import { GameDaySelector } from "./GameDaySelector";
import { LigaSelector } from "./LigaSelector";
import { performAction } from "./server-actions/perform-action";
import { BetterService } from "./services/better-service";
import { GameDayService } from "./services/game-day-service";
import { LigaService } from "./services/liga-service";

export default async function EditBetPage({
  searchParams,
}: {
  searchParams: { liga_id?: string; game_day_id?: string; better_id?: string };
}) {
  const ligas = await new LigaService().getLigas();
  const game_days = await new GameDayService().getGameDaysByLiga(
    searchParams.liga_id ?? ""
  );
  const betters = await new BetterService().getBetters();

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Bet</Typography>
          </Box>
          <Grid container spacing={2} component={"form"} action={performAction}>
            <LigaSelector ligas={ligas} />
            <GameDaySelector game_days={game_days} />
            <BetterDaySelector betters={betters} />
            <Input
              type="hidden"
              name="liga_id"
              value={searchParams.liga_id ?? ""}
            />
            <Input
              type="hidden"
              name="game_day_id"
              value={searchParams.game_day_id ?? ""}
            />
            <Input
              type="hidden"
              name="better_id"
              value={searchParams.better_id ?? ""}
            />
            <Button
              name="save"
              type="submit"
              color="secondary"
              variant="contained"
              // disabled={isLoading || isDisabled}
            >
              Save
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

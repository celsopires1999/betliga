"use server";
import { Better } from "@/frontend/types/Better";
import {
  Box,
  FormControl,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { BetterDaySelector } from "./BetterSelector";
import { CommandButtons } from "./CommandButtons";
import { EditBetForm } from "./EditBetForm";
import { GameDaySelector } from "./GameDaySelector";
import { LigaSelector } from "./LigaSelector";
import { GameDayService } from "./services/game-day-service";
import { LigaService } from "./services/liga-service";

export default async function EditBetPage({
  searchParams: { liga_id, game_day_id, better_id },
}: {
  searchParams: { liga_id?: string; game_day_id?: string; better_id?: string };
}) {
  const ligas = await new LigaService().getLigas();

  const gameDayService = new GameDayService();
  const game_days = (await gameDayService.listGameDaysByLiga(liga_id)) ?? [];
  const selectedGameDay = await gameDayService.getGameDayById(game_day_id);
  const betters = selectedGameDay?.bets.map((b) => b.better) as Better[];
  const bet = selectedGameDay?.bets.find((b) => b.better.id === better_id);
  const scores = bet?.scores.map((s) => {
    const gameId = selectedGameDay?.games.find(
      (g) => g.gameNumber === s.gameNumber
    );
    return { ...s, gameId: gameId?.id };
  });

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit Bet</Typography>
          </Box>
        </Box>
        <EditBetForm>
          <Grid container spacing={2}>
            <Grid xs={12} md={9}>
              <LigaSelector ligas={ligas} />
            </Grid>
            <Grid xs={12} md={9}>
              <GameDaySelector game_days={game_days} />
            </Grid>
            <Grid xs={12} md={9}>
              <BetterDaySelector betters={betters} />
            </Grid>
            <Input type="hidden" name="liga_id" value={liga_id ?? ""} />
            <Input type="hidden" name="game_day_id" value={game_day_id ?? ""} />
            <Input type="hidden" name="better_id" value={better_id ?? ""} />
            <Input type="hidden" name="bet_id" value={bet?.id} />

            {/* {bet?.scores && ( */}
            {scores && (
              <Grid mt={2} xs={12}>
                <Typography variant="h6">Games</Typography>
              </Grid>
            )}

            {scores?.map((s) => {
              return (
                <Grid container xs={12} md={9} key={s.id}>
                  <Grid xs={6} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        // name={`game[${g.gameNumber}][home]`}
                        name="home[]"
                        label={s.home}
                        type="number"
                        defaultValue={s.homeGols}
                      />
                    </FormControl>
                  </Grid>

                  <Grid xs={6} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        // name={`${g.gameNumber}`}
                        // name={`game[${g.gameNumber}][away]`}
                        name="away[]"
                        label={s.away}
                        type="number"
                        defaultValue={s.awayGols}
                      />
                    </FormControl>
                    <Input
                      type="hidden"
                      name="game_number[]"
                      value={s.gameNumber}
                    />
                    <Input type="hidden" name="game_id[]" value={s.gameId} />
                  </Grid>
                </Grid>
              );
            })}
            <Grid xs={12}>
              <CommandButtons />
            </Grid>
          </Grid>
        </EditBetForm>
      </Paper>
    </Box>
  );
}

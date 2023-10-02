"use client";

import { useGameDayEvaluation } from "@/frontend/features/game-day/hooks/useGameDayEvaluation";
import { useGameDaySelector } from "@/frontend/hooks/useGameDaySelector";
import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import { BettersTabs } from "./components/BettersTabs";
import { GameDaySelector } from "./components/GameDaySelector";

export function GameDayEvaluation() {
  const [
    ligas,
    gameDays,
    ligaState,
    isLoadingGameDay,
    isDisabled,
    getGameDays,
    gameDayState,
    handleLigaChange,
    handleGameDayChange,
  ] = useGameDaySelector();

  const [data, isLoadingGameDayEvaluation] = useGameDayEvaluation(
    gameDayState.gameDay?.id
  );

  const isLoading = isLoadingGameDay || isLoadingGameDayEvaluation;

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Evaluation</Typography>
          </Box>
        </Box>
        <Grid container spacing={2} p={2}>
          <GameDaySelector
            ligas={ligas}
            gameDays={gameDays}
            ligaState={ligaState}
            isLoading={isLoading}
            isDisabled={isDisabled}
            getGameDays={getGameDays}
            gameDayState={gameDayState}
            handleLigaChange={handleLigaChange}
            handleGameDayChange={handleGameDayChange}
          />
          <BettersTabs data={data} />
          <Grid xs={12}>
            <Box display="flex" gap={2}>
              <Button
                name="back"
                variant="contained"
                href="/"
                LinkComponent={Link}
              >
                Back
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

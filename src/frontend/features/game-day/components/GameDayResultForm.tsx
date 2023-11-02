"use client";

import { GameDayState, LigaState } from "@/frontend/hooks/useGameDaySelector";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import { GameDaySelector } from "./GameDaySelector";

type Props = {
  ligas?: Liga[];
  isLoading: boolean;
  isDisabled: boolean;
  ligaState: LigaState;
  gameDays?: GameDay[];
  gameDayState: GameDayState;
  calculatePoints: () => void;
  getHomeGols: (gameNumber: number) => number | "";
  getAwayGols: (gameNumber: number) => number | "";
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleLigaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGameDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleScoreHomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleScoreAwayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getGameDays: (ligaId?: string, gameDays?: GameDay[]) => GameDay[] | undefined;
};

export function ResultForm({
  ligas,
  gameDays,
  isLoading,
  ligaState,
  isDisabled,
  getGameDays,
  getHomeGols,
  getAwayGols,
  gameDayState,
  handleSubmit,
  calculatePoints,
  handleLigaChange,
  handleGameDayChange,
  handleScoreHomeChange,
  handleScoreAwayChange,
}: Props) {
  return (
    <form onSubmit={handleSubmit}>
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

        {gameDayState.gameDay && (
          <Grid mt={2} xs={12}>
            <Typography variant="h6">Games</Typography>
          </Grid>
        )}
        {gameDayState.gameDay?.games.map((g) => {
          return (
            <Grid container xs={12} md={9} key={g.id}>
              <Grid xs={6} md={6}>
                <FormControl fullWidth>
                  <TextField
                    name={`${g.gameNumber}`}
                    label={g.home.name}
                    type="number"
                    value={getHomeGols(g.gameNumber)}
                    disabled={isLoading || isDisabled}
                    onChange={handleScoreHomeChange}
                  />
                </FormControl>
              </Grid>

              <Grid xs={6} md={6}>
                <FormControl fullWidth>
                  <TextField
                    name={`${g.gameNumber}`}
                    label={g.away.name}
                    type="number"
                    value={getAwayGols(g.gameNumber)}
                    disabled={isLoading || isDisabled}
                    onChange={handleScoreAwayChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          );
        })}

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
            <Button
              name="save"
              type="submit"
              color="secondary"
              variant="contained"
              disabled={isLoading || isDisabled}
            >
              {isLoading ? "Loading" : "Save"}
            </Button>
            <Button
              color="warning"
              variant="contained"
              name="calculate-points"
              onClick={calculatePoints}
              disabled={isLoading || isDisabled}
            >
              Calculate Points
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

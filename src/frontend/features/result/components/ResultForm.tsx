"use client";

import { AutocompleteField } from "@/frontend/components/AutocompleteField";
import { AutocompleteGameDay } from "@/frontend/components/AutocompleteGameDay";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Result } from "@/frontend/types/Result";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";

type Props = {
  ligas?: Liga[];
  isLoading: boolean;
  isDisabled: boolean;
  resultState: Result;
  gameDays?: GameDay[];
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
  isDisabled,
  resultState,
  getGameDays,
  getHomeGols,
  getAwayGols,
  handleSubmit,
  handleLigaChange,
  handleGameDayChange,
  handleScoreHomeChange,
  handleScoreAwayChange,
}: Props) {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} p={2}>
        <Grid xs={12} md={9}>
          <AutocompleteField
            name="liga"
            label="Liga"
            options={ligas}
            value={resultState.liga.id === "" ? null : resultState.liga}
            handleChange={handleLigaChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

        <Grid xs={12} md={9}>
          <AutocompleteGameDay
            name="gameDay"
            label="Game Day"
            options={getGameDays(resultState.liga?.id, gameDays)}
            value={resultState.gameDay.round === 0 ? null : resultState.gameDay}
            handleChange={handleGameDayChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

        {resultState.gameDay && (
          <Grid mt={2} xs={12}>
            <Typography variant="h6">Games</Typography>
          </Grid>
        )}
        {resultState.gameDay?.games.map((g) => {
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
              variant="contained"
              color="secondary"
              disabled={isLoading || isDisabled}
            >
              {isLoading ? "Loading" : "Save"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

import { AutocompleteField } from "@/frontend/components/AutocompleteField";
import { AutocompleteGameDay } from "@/frontend/components/AutocompleteGameDay";
import { Bet } from "@/frontend/types/Bet";
import { Better } from "@/frontend/types/Better";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";

type Props = {
  betState: Bet;
  ligas?: Liga[];
  betters?: Better[];
  isLoading: boolean;
  gameDays?: GameDay[];
  isDisabled: boolean;
  getHomeGols: (gameNumber: number) => number | "";
  getAwayGols: (gameNumber: number) => number | "";
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLigaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGameDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetScoreHomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBetScoreAwayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getGameDays: (ligaId?: string, gameDays?: GameDay[]) => GameDay[] | undefined;
};

export function BetForm({
  ligas,
  betters,
  betState,
  gameDays,
  isLoading,
  isDisabled,
  getGameDays,
  getHomeGols,
  getAwayGols,
  handleSubmit,
  handleChange,
  handleLigaChange,
  handleGameDayChange,
  handleBetScoreHomeChange,
  handleBetScoreAwayChange,
}: Props) {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} md={9}>
          <AutocompleteField
            name="better"
            label="Better"
            options={betters}
            value={betState.better.id === "" ? null : betState.better}
            handleChange={handleChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

        <Grid xs={12} md={9}>
          <AutocompleteField
            name="liga"
            label="Liga"
            options={ligas}
            value={betState.liga.id === "" ? null : betState.liga}
            handleChange={handleLigaChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

        <Grid xs={12} md={9}>
          <AutocompleteGameDay
            name="gameDay"
            label="Game Day"
            options={getGameDays(betState.liga?.id, gameDays)}
            value={betState.gameDay.round === 0 ? null : betState.gameDay}
            handleChange={handleGameDayChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

        {betState.gameDay && (
          <Grid mt={2} xs={12}>
            <Typography variant="h6">Games</Typography>
          </Grid>
        )}
        {betState.gameDay?.games.map((g) => {
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
                    onChange={handleBetScoreHomeChange}
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
                    onChange={handleBetScoreAwayChange}
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

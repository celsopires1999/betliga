import { AutocompleteField } from "@/frontend/components/AutocompleteField";
import { GameDayState, LigaState } from "@/frontend/hooks/useGameDaySelector";
import { Better } from "@/frontend/types/Better";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import { GameDaySelector } from "../../game-day/components/GameDaySelector";
import { BetState } from "../CreateBet";

type Props = {
  betState: BetState;
  ligaState: LigaState;
  gameDayState: GameDayState;
  ligas?: Liga[];
  betters?: Better[];
  isLoading: boolean;
  isDisabled: boolean;
  gameDays?: GameDay[];
  getHomeGols: (gameNumber: number) => number | "";
  getAwayGols: (gameNumber: number) => number | "";
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLigaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGameDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleScoreHomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleScoreAwayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getGameDays: (ligaId?: string, gameDays?: GameDay[]) => GameDay[] | undefined;
};

export function BetForm({
  ligas,
  betters,
  betState,
  ligaState,
  gameDayState,
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
  handleScoreHomeChange,
  handleScoreAwayChange,
}: Props) {
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
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

        <Grid xs={12} md={9}>
          <AutocompleteField
            name="better"
            label="Better"
            options={betters}
            value={betState?.better?.id === "" ? null : betState.better}
            handleChange={handleChange}
            disabled={isLoading || isDisabled}
          />
        </Grid>

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

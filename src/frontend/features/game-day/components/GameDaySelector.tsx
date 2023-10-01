"use client";

import { AutocompleteField } from "@/frontend/components/AutocompleteField";
import { AutocompleteGameDay } from "@/frontend/components/AutocompleteGameDay";
import { GameDayState, LigaState } from "@/frontend/hooks/useGameDaySelector";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { ChangeEvent } from "react";

type Props = {
  ligas?: Liga[];
  isLoading: boolean;
  isDisabled: boolean;
  gameDays?: GameDay[];
  ligaState: LigaState;
  gameDayState: GameDayState;
  handleLigaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGameDayChange: (e: ChangeEvent<HTMLInputElement>) => void;
  getGameDays: (ligaId?: string, gameDays?: GameDay[]) => GameDay[] | undefined;
};

export function GameDaySelector({
  ligas,
  gameDays,
  ligaState,
  isLoading,
  isDisabled,
  getGameDays,
  gameDayState,
  handleLigaChange,
  handleGameDayChange,
}: Props) {
  return (
    <>
      <Grid xs={12} md={9}>
        <AutocompleteField
          name="liga"
          label="Liga"
          options={ligas}
          value={ligaState?.liga?.id === "" ? null : ligaState?.liga}
          handleChange={handleLigaChange}
          disabled={isLoading || isDisabled}
        />
      </Grid>

      <Grid xs={12} md={9}>
        <AutocompleteGameDay
          name="gameDay"
          label="Game Day"
          options={getGameDays(ligaState?.liga?.id, gameDays)}
          value={
            gameDayState?.gameDay?.round === 0 ? null : gameDayState.gameDay
          }
          handleChange={handleGameDayChange}
          disabled={isLoading || isDisabled}
        />
      </Grid>
    </>
  );
}

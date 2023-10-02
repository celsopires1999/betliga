import { useSnackbar } from "notistack";
import { useEffect } from "react";
import useSWR from "swr";
import { GameDayEvaluation } from "../../../types/GameDay";
import { fetcher } from "../../../utils/http";

export function useGameDayEvaluation(gameDayId: string | null) {
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, isLoading } = useSWR<GameDayEvaluation>(
    gameDayId ? `/api/game-days/${gameDayId}` : null,
    fetcher
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  return [data, isLoading] as const;
}

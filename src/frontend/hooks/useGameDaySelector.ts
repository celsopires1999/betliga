import { useEffect, useState } from "react";
import { GameDay } from "../types/GameDay";
import { Liga } from "../types/Liga";
import { fetcher } from "../utils/http";
import useSWR from "swr";
import { useSnackbar } from "notistack";

export type LigaState = {
  liga: Liga;
};

export type GameDayState = {
  gameDay: GameDay;
};

export function useGameDaySelector() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const initialLigaState: LigaState = {
    liga: { id: "", name: "" },
  };
  const initialGameDayState: GameDayState = {
    gameDay: {
      id: "",
      ligaId: "",
      round: 0,
      liga: { id: "", name: "" },
      games: [],
    },
  };

  const [ligaState, setLigaState] = useState<LigaState>(initialLigaState);
  const [gameDayState, setGameDayState] =
    useState<GameDayState>(initialGameDayState);

  const {
    data: ligas,
    error: errorLiga,
    isLoading: isLoadingLiga,
  } = useSWR<Liga[]>(`/api/ligas`, fetcher, {
    fallbackData: [],
  });

  const {
    data: gameDays,
    error: errorGameDay,
    isLoading: isLoadingGameDay,
  } = useSWR<GameDay[]>(
    ligaState?.liga?.id ? `/api/game-days?ligaId=${ligaState.liga.id}` : null,
    fetcher,
    {
      fallbackData: [],
    }
  );

  const isLoading = isLoadingLiga || isLoadingGameDay;
  const error = errorLiga ? errorLiga : errorGameDay;

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleLigaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLigaState({ ...ligaState, [name]: value });
    setGameDayState(initialGameDayState);
  };

  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameDayState({ ...gameDayState, [name]: value });
  };

  const getGameDays = (ligaId?: string, gameDays?: GameDay[]) => {
    if (!ligaId || !gameDays) {
      return undefined;
    }
    const foundGameDays = gameDays.filter((g) => g.ligaId === ligaId);
    if (foundGameDays.length === 0) {
      return undefined;
    }
    return foundGameDays;
  };

  return [
    ligas,
    gameDays,
    ligaState,
    isLoading,
    isDisabled,
    getGameDays,
    gameDayState,
    handleLigaChange,
    handleGameDayChange,
  ] as const;
}

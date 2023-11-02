import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { GameDay } from "../types/GameDay";
import { Liga } from "../types/Liga";
import { fetcher } from "../utils/http";

export type LigaState = {
  liga: Liga;
};

export type GameDayState = {
  gameDay: GameDay;
};

export function useGameDaySelector() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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
  const [isLigaSet, setIsLigaSet] = useState(false);
  const [isGameDaySet, setIsGameDaySet] = useState(false);

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

  if (!isLigaSet && ligas?.length != 0) {
    setIsLigaSet(true);
    const ligaId = searchParams.get("liga_id")?.toString();
    const liga = ligas?.find((liga) => liga.id === ligaId);
    liga && setLigaState({ ...ligaState, ["liga"]: liga });
  }

  if (!isGameDaySet && gameDays?.length != 0) {
    setIsGameDaySet(true);
    const gameDayId = searchParams.get("game_day_id")?.toString();
    const gameDay = gameDays?.find((gameDay) => gameDay.id === gameDayId);
    gameDay && setGameDayState({ ...gameDayState, ["gameDay"]: gameDay });
  }

  const isLoading = isLoadingLiga || isLoadingGameDay;
  const isDisabled = isLoading;
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

    const params = new URLSearchParams(searchParams);

    if (value) {
      const liga = value as unknown as { id: string };
      params.set("liga_id", liga.id);
    } else {
      params.delete("liga_id");
    }
    params.delete("game_day_id");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameDayState({ ...gameDayState, [name]: value });
    const params = new URLSearchParams(searchParams);

    if (value) {
      const gameDay = value as unknown as { id: string };
      params.set("game_day_id", gameDay.id);
    } else {
      params.delete("game_day_id");
    }
    replace(`${pathname}?${params.toString()}`);
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

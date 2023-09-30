"use client";

import { Bet } from "@/frontend/types/Bet";
import { Better } from "@/frontend/types/Better";
import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { fetcher } from "@/frontend/utils/http";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { BetForm } from "./components/BetForm";

export function CreateBet() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const initialBetState: Bet = {
    liga: { id: "", name: "" },
    better: { id: "", name: "" },
    gameDay: {
      id: "",
      ligaId: "",
      round: 0,
      liga: { id: "", name: "" },
      games: [],
    },
    betScores: [],
  };
  const [betState, setBetState] = useState<Bet>(initialBetState);

  const {
    data: ligas,
    error: errorLiga,
    isLoading: isLoadingLiga,
  } = useSWR<Liga[]>(`/api/ligas`, fetcher, {
    fallbackData: [],
  });

  const {
    data: betters,
    error: errorBetter,
    isLoading: isLoadingBetter,
  } = useSWR<Better[]>(`/api/betters`, fetcher, {
    fallbackData: [],
  });

  const {
    data: gameDays,
    error: errorGameDay,
    isLoading: isLoadingGameDay,
  } = useSWR<GameDay[]>(
    betState.liga?.id ? `/api/game-days?ligaId=${betState.liga?.id}` : null,
    fetcher,
    {
      fallbackData: [],
    }
  );

  const isLoading = isLoadingLiga || isLoadingBetter || isLoadingGameDay;
  const error = errorLiga
    ? errorLiga
    : errorBetter
    ? errorBetter
    : errorGameDay;

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBetState({ ...betState, [name]: value });
  };

  const handleLigaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBetState({
      ...betState,
      [name]: value,
      ["gameDay"]: initialBetState.gameDay,
      ["betScores"]: [],
    });
  };

  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBetState({ ...betState, [name]: value, ["betScores"]: [] });
  };

  const handleScoreHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const betScores = [...betState.betScores];

    const index = betScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      betScores.push({
        gameNumber,
        homeGols: value !== "" ? +value : ("" as unknown as number),
        awayGols: "" as unknown as number,
      });
    } else {
      betScores[index] = {
        gameNumber,
        homeGols: value !== "" ? +value : ("" as unknown as number),
        awayGols: betScores[index]?.awayGols,
      };
    }

    setBetState({ ...betState, betScores });
  };

  const handleScoreAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const betScores = [...betState.betScores];

    const index = betScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      betScores.push({
        gameNumber,
        homeGols: "" as unknown as number,
        awayGols: value !== "" ? +value : ("" as unknown as number),
      });
    } else {
      betScores[index] = {
        gameNumber,
        homeGols: betScores[index]?.homeGols,
        awayGols: value !== "" ? +value : ("" as unknown as number),
      };
    }

    setBetState({ ...betState, betScores });
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

  const getHomeGols = (gameNumber: number) => {
    const score = betState.betScores.find((g) => g.gameNumber === gameNumber);
    return score?.homeGols ?? "";
  };

  const getAwayGols = (gameNumber: number) => {
    const score = betState.betScores.find((g) => g.gameNumber === gameNumber);
    return score?.awayGols ?? "";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);
    const data = {
      liga: {
        name: betState.liga?.name,
      },
      better: {
        name: betState.better?.name,
      },
      gameDay: {
        round: betState.gameDay?.round,
      },
      betScores: betState.betScores,
    };

    const response = await fetch(`/api/bets`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      enqueueSnackbar(`Bet created successfully`, { variant: "success" });
      setBetState(initialBetState);
    } else {
      console.error(
        `There was an error on Bet creation. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Bet not created: ${response.statusText}`, {
        variant: "error",
      });
    }

    setIsDisabled(false);
  }

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create Bet</Typography>
          </Box>
        </Box>
        <BetForm
          ligas={ligas}
          betters={betters}
          betState={betState}
          gameDays={gameDays}
          isLoading={isLoading}
          isDisabled={isDisabled}
          getAwayGols={getAwayGols}
          getGameDays={getGameDays}
          getHomeGols={getHomeGols}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleLigaChange={handleLigaChange}
          handleGameDayChange={handleGameDayChange}
          handleScoreAwayChange={handleScoreAwayChange}
          handleScoreHomeChange={handleScoreHomeChange}
        />
      </Paper>
    </Box>
  );
}

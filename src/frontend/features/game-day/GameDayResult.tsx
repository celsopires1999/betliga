"use client";

import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Result, Score } from "@/frontend/types/Result";
import { fetcher } from "@/frontend/utils/http";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ResultForm } from "./components/GameDayResultForm";

export function GameDayResult() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const initialResultState: Result = {
    liga: { id: "", name: "" },
    gameDay: {
      id: "",
      ligaId: "",
      round: 0,
      liga: { id: "", name: "" },
      games: [],
    },
  };
  const initialScoreState: Score[] = [];
  const [resultState, setResultState] = useState<Result>(initialResultState);
  const [scoreState, setScoreState] = useState<Score[]>(initialScoreState);

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
    resultState.liga?.id
      ? `/api/game-days?ligaId=${resultState.liga?.id}`
      : null,
    fetcher,
    {
      fallbackData: [],
    }
  );

  const isLoading = isLoadingLiga || isLoadingGameDay;
  const error = errorLiga ? errorLiga : errorGameDay;

  useEffect(() => {
    if (scoreState?.length !== 0) {
      return;
    }

    setScoreState(resultState?.gameDay?.games);
  }, [scoreState?.length, resultState]);

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleLigaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResultState({
      ...resultState,
      [name]: value,
      ["gameDay"]: initialResultState.gameDay,
    });
    setScoreState(initialScoreState);
  };
  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResultState({ ...resultState, [name]: value });
    setScoreState(initialScoreState);
  };

  const handleScoreHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const resultScores = [...scoreState];

    const index = resultScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      resultScores.push({
        gameNumber,
        homeGols: +value,
        awayGols: 0,
      });
    } else {
      resultScores[index] = {
        gameNumber,
        homeGols: +value,
        awayGols: resultScores[index]?.awayGols,
      };
    }

    setScoreState(resultScores);
  };

  const handleScoreAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const resultScores = [...scoreState];

    const index = resultScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      resultScores.push({
        gameNumber,
        homeGols: 0,
        awayGols: +value,
      });
    } else {
      resultScores[index] = {
        gameNumber,
        homeGols: resultScores[index]?.homeGols,
        awayGols: +value,
      };
    }

    setScoreState(resultScores);
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
    const score = scoreState.find((g) => g.gameNumber === gameNumber);
    return score?.homeGols ?? "";
  };

  const getAwayGols = (gameNumber: number) => {
    const score = scoreState.find((g) => g.gameNumber === gameNumber);
    return score?.awayGols ?? "";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);
    const data = {
      games: scoreState,
    };
    const response = await fetch(
      `/api/game-days/${resultState.gameDay?.id}/result`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      enqueueSnackbar(`Result processed successfully`, { variant: "success" });
    } else {
      console.error(
        `There was an error on Result processing. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Result not processed: ${response.statusText}`, {
        variant: "error",
      });
    }

    setResultState(initialResultState);
    setScoreState(initialScoreState);
    setIsDisabled(false);
  }

  async function calculatePoints() {
    setIsDisabled(true);
    // const data = {
    //   games: scoreState,
    // };
    const response = await fetch(
      `/api/game-days/${resultState.gameDay?.id}/calculate-points`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        // body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      enqueueSnackbar(`Points calculated successfully`, { variant: "success" });
    } else {
      console.error(
        `There was an error on calculating points. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Points not calculated: ${response.statusText}`, {
        variant: "error",
      });
    }
    // setResultState(initialResultState);
    // setScoreState(initialScoreState);
    setIsDisabled(false);
  }

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Result</Typography>
          </Box>
        </Box>
        <ResultForm
          ligas={ligas}
          gameDays={gameDays}
          isLoading={isLoading}
          isDisabled={isDisabled}
          getAwayGols={getAwayGols}
          getGameDays={getGameDays}
          getHomeGols={getHomeGols}
          resultState={resultState}
          handleSubmit={handleSubmit}
          calculatePoints={calculatePoints}
          handleLigaChange={handleLigaChange}
          handleGameDayChange={handleGameDayChange}
          handleScoreHomeChange={handleScoreHomeChange}
          handleScoreAwayChange={handleScoreAwayChange}
        />
      </Paper>
    </Box>
  );
}

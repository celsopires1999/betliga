"use client";

import { useGameDaySelector } from "@/frontend/hooks/useGameDaySelector";
import { Score } from "@/frontend/types/Result";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { ResultForm } from "./components/GameDayResultForm";

export function GameDayResult() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const initialScoreState: Score[] = [];
  const [scoreState, setScoreState] = useState<Score[]>(initialScoreState);
  const [
    ligas,
    gameDays,
    ligaState,
    isLoadingGameDay,
    isDisabledGameDay,
    getGameDays,
    gameDayState,
    handleLigaChange,
    handleGameDayChange,
  ] = useGameDaySelector();

  const isLoading = isLoadingGameDay;

  useEffect(() => {
    if (scoreState?.length !== 0) {
      return;
    }
    setScoreState(gameDayState.gameDay.games);
  }, [scoreState?.length, gameDayState.gameDay.games]);

  const handleScoreHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const resultScores = [...scoreState];

    const index = resultScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      resultScores.push({
        gameNumber,
        homeGols: value !== "" ? +value : ("" as unknown as number),
        awayGols: "" as unknown as number,
      });
    } else {
      resultScores[index] = {
        gameNumber,
        homeGols: value !== "" ? +value : ("" as unknown as number),
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
        homeGols: "" as unknown as number,
        awayGols: value !== "" ? +value : ("" as unknown as number),
      });
    } else {
      resultScores[index] = {
        gameNumber,
        homeGols: resultScores[index]?.homeGols,
        awayGols: value !== "" ? +value : ("" as unknown as number),
      };
    }

    setScoreState(resultScores);
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
      `/api/game-days/${gameDayState.gameDay.id}/result`,
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
      mutate(`/api/game-days?ligaId=${gameDayState.gameDay.ligaId}`);
    } else {
      console.error(
        `There was an error on Result processing. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Result not processed: ${response.statusText}`, {
        variant: "error",
      });
    }

    setIsDisabled(false);
  }

  async function calculatePoints() {
    setIsDisabled(true);
    const response = await fetch(
      `/api/game-days/${gameDayState.gameDay.id}/calculate-points`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
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
          ligaState={ligaState}
          getAwayGols={getAwayGols}
          getGameDays={getGameDays}
          getHomeGols={getHomeGols}
          gameDayState={gameDayState}
          handleSubmit={handleSubmit}
          calculatePoints={calculatePoints}
          handleLigaChange={handleLigaChange}
          handleGameDayChange={handleGameDayChange}
          isDisabled={isDisabled || isDisabledGameDay}
          handleScoreHomeChange={handleScoreHomeChange}
          handleScoreAwayChange={handleScoreAwayChange}
        />
      </Paper>
    </Box>
  );
}

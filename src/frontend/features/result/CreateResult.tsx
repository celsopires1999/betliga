"use client";

import { GameDay } from "@/frontend/types/GameDay";
import { Liga } from "@/frontend/types/Liga";
import { Result } from "@/frontend/types/Result";
import { fetcher } from "@/frontend/utils/http";
import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ResultForm } from "./components/ResultForm";

export function CreateResult() {
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
    resultScores: [],
  };
  const [resultState, setResultState] = useState<Result>(initialResultState);

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
      ["resultScores"]: [],
    });
  };

  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResultState({ ...resultState, [name]: value, ["resultScores"]: [] });
  };

  const handleScoreHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const betScores = [...resultState.resultScores];

    const index = betScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      betScores.push({
        gameNumber,
        homeGols: +value,
        awayGols: 0,
      });
    } else {
      betScores[index] = {
        gameNumber,
        homeGols: +value,
        awayGols: betScores[index]?.awayGols,
      };
    }

    setResultState({ ...resultState, resultScores: betScores });
  };

  const handleScoreAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const resultScores = [...resultState.resultScores];

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

    setResultState({ ...resultState, resultScores: resultScores });
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
    const score = resultState.resultScores.find(
      (g) => g.gameNumber === gameNumber
    );
    return score?.homeGols ?? "";
  };

  const getAwayGols = (gameNumber: number) => {
    const score = resultState.resultScores.find(
      (g) => g.gameNumber === gameNumber
    );
    return score?.awayGols ?? "";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);
    const data = {
      games: resultState.resultScores,
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
      enqueueSnackbar(`Result created successfully`, { variant: "success" });
      setResultState(initialResultState);
    } else {
      console.error(
        `There was an error on Result creation. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Result not created: ${response.statusText}`, {
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
            <Typography variant="h4">Create Result</Typography>
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
          handleLigaChange={handleLigaChange}
          handleGameDayChange={handleGameDayChange}
          handleScoreHomeChange={handleScoreHomeChange}
          handleScoreAwayChange={handleScoreAwayChange}
        />
      </Paper>
    </Box>
  );
}

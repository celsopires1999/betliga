"use client";

import { AutocompleteField } from "@/frontend/components/AutocompleteField";
import { fetcher } from "@/frontend/utils/http";
import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AutocompleteGameDay } from "./components/AutocompleteGameDay";
import Link from "next/link";
import { useSnackbar } from "notistack";

export type Bet = {
  liga?: {
    id: string;
    name: string;
  } | null;
  better?: {
    id: string;
    name: string;
  } | null;
  gameDay?: GameDay | null;
  betScores: {
    gameNumber: number | undefined;
    homeGols: number | undefined;
    awayGols: number | undefined;
  }[];
};

export type GameDay = {
  id: string;
  round: number;
  ligaId: string;
  games: {
    id: string;
    gameNumber: number;
    home: {
      id: string;
      name: string;
    };
    away: {
      id: string;
      name: string;
    };
  }[];
};

type Liga = {
  id: string;
  name: string;
};

type Better = {
  id: string;
  name: string;
};

export function CreateBet() {
  const { enqueueSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const initialBetState: Bet = {
    liga: null,
    better: null,
    gameDay: null,
    betScores: [],
  };
  const [betState, setBetState] = useState<Bet>(initialBetState);

  const {
    data: ligas,
    error: errorLiga,
    isLoading: isLoadingLiga,
  } = useSWR<Liga[]>(`api/ligas`, fetcher, {
    fallbackData: [],
  });

  const {
    data: betters,
    error: errorBetter,
    isLoading: isLoadingBetter,
  } = useSWR<Better[]>(`api/betters`, fetcher, {
    fallbackData: [],
  });

  const {
    data: gameDays,
    error: errorGameDay,
    isLoading: isLoadingGameDay,
  } = useSWR<GameDay[]>(
    betState.liga?.id ? `api/game-days?ligaId=${betState.liga?.id}` : null,
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
      ["gameDay"]: null,
      ["betScores"]: [],
    });
  };

  const handleGameDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBetState({ ...betState, [name]: value, ["betScores"]: [] });
  };

  const handleBetScoreHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const betScores = [...betState.betScores];

    const index = betScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      betScores.push({
        gameNumber,
        homeGols: +value,
        awayGols: undefined,
      });
    } else {
      betScores[index] = {
        gameNumber,
        homeGols: +value,
        awayGols: betScores[index]?.awayGols,
      };
    }

    setBetState({ ...betState, betScores });
  };

  const handleBetScoreAwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const gameNumber = +name;
    const betScores = [...betState.betScores];

    const index = betScores.findIndex((s) => s.gameNumber === gameNumber);
    if (index === -1) {
      betScores.push({
        gameNumber,
        homeGols: undefined,
        awayGols: +value,
      });
    } else {
      betScores[index] = {
        gameNumber,
        homeGols: betScores[index]?.homeGols,
        awayGols: +value,
      };
    }

    setBetState({ ...betState, betScores });
  };

  const getGameDays = (ligaId?: string, gameDays?: GameDay[]) => {
    if (!ligaId || !gameDays) {
      return undefined;
    }
    const foundGameDays = gameDays.filter((g) => g.ligaId === ligaId);
    if (!foundGameDays) {
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

    const response = await fetch(`api/bets`, {
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
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} p={2}>
            <Grid xs={12} md={9}>
              <AutocompleteField
                name="better"
                label="Better"
                options={betters}
                value={betState.better}
                handleChange={handleChange}
                disabled={isLoading || isDisabled}
              />
            </Grid>

            <Grid xs={12} md={9}>
              <AutocompleteField
                name="liga"
                label="Liga"
                options={ligas}
                value={betState.liga}
                handleChange={handleLigaChange}
                disabled={isLoading || isDisabled}
              />
            </Grid>

            <Grid xs={12} md={9}>
              <AutocompleteGameDay
                name="gameDay"
                label="Game Day"
                options={getGameDays(betState.liga?.id, gameDays)}
                value={betState.gameDay}
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
      </Paper>
    </Box>
  );
}

"use client";

import { useLoadAutocompleteFields } from "@/frontend/hooks/useLoadAutocompleteFields";
import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { AutocompleteField } from "../../components/AutocompleteField";
import { Game, GameDay } from "../../types";
import GamesTable from "./components/GamesTable";
import Link from "next/link";

export default function CreateGameDay() {
  const { enqueueSnackbar } = useSnackbar();
  const initialGameDayState: GameDay = {
    liga: null,
    round: 1,
    games: [],
  };
  const initialGameState = {
    gameNumber: null,
    home: null,
    away: null,
  };
  const [gameDayState, setGameDayState] =
    useState<GameDay>(initialGameDayState);
  const [gameState, setGameState] = useState<Game>(initialGameState);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [ligas, teams, isLoading, error] = useLoadAutocompleteFields();

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameDayState({ ...gameDayState, [name]: value });
  };

  const handleChangeGame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameState({ ...gameState, [name]: value });
  };

  const addGame = () => {
    let games: Game[] = gameDayState?.games ? gameDayState?.games : [];
    const gameNumber = games.length + 1;
    gameState && games.push({ ...gameState, gameNumber });
    setGameDayState({ ...gameDayState, games });
    setGameState(initialGameState);
  };

  const deleteGames = (gamesNumbers: readonly number[]) => {
    let games: Game[] = gameDayState?.games ? gameDayState?.games : [];
    for (const gameNumber of gamesNumbers) {
      games = games.filter((g) => g.gameNumber !== gameNumber);
    }
    for (let i = 0; i < games.length; i++) {
      games[i].gameNumber = i + 1;
    }
    setGameDayState({ ...gameDayState, games });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);
    const data = {
      liga: {
        name: gameDayState?.liga?.name,
      },
      round: parseInt(gameDayState?.round as unknown as string),
      games: gameDayState?.games?.map((g) => {
        return {
          gameNumber: g.gameNumber,
          home: g.home?.name,
          away: g.away?.name,
        };
      }),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/game-days`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      enqueueSnackbar(`Game Day created successfully`, { variant: "success" });
      setGameDayState(initialGameDayState);
    } else {
      console.error(
        `There was an error on Game Day creation. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`Game Day not created: ${response.statusText}`, {
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
            <Typography variant="h4">Create Game Day</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* <Grid container spacing={2} mt={2}> */}
          <Grid container spacing={2} p={2}>
            <Grid xs={12} md={9}>
              <AutocompleteField
                name="liga"
                label="Liga"
                options={ligas}
                disabled={isLoading || isDisabled}
                value={gameDayState?.liga}
                handleChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <TextField
                  name="round"
                  label="Round"
                  type="number"
                  value={gameDayState?.round}
                  disabled={isLoading || isDisabled}
                  onChange={handleChange}
                  inputProps={{ "data-testid": "round" }}
                />
              </FormControl>
            </Grid>

            <Grid xs={6} md={5}>
              <AutocompleteField
                name="home"
                label="Home"
                options={teams}
                disabled={isLoading || isDisabled}
                value={gameState?.home}
                handleChange={handleChangeGame}
              />
            </Grid>
            <Grid xs={6} md={5}>
              <AutocompleteField
                name="away"
                label="Away"
                options={teams}
                disabled={isLoading || isDisabled}
                value={gameState?.away}
                handleChange={handleChangeGame}
              />
            </Grid>
            <Grid
              xs={12}
              md={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                fullWidth
                onClick={addGame}
                variant="contained"
                disabled={isLoading || !gameState.home || !gameState.away}
              >
                Add Game
              </Button>
            </Grid>

            <Grid xs={12} md={10} display="flex">
              <GamesTable
                games={gameDayState?.games ?? []}
                deleteGames={deleteGames}
              />
            </Grid>
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

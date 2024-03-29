"use client";

import { useLoadAutocompleteFields } from "@/frontend/hooks/useLoadAutocompleteFields";
import { Game } from "@/frontend/types/Game";
import { GameDay } from "@/frontend/types/GameDay";
import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { AutocompleteField } from "../../components/AutocompleteField";
import { GamesLoader } from "./components/GamesLoader";
import GamesTable from "./components/GamesTable";

export default function CreateGameDay() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const initialGameDayState: GameDay = {
    id: "",
    ligaId: "",
    liga: { id: "", name: "" },
    round: 1,
    games: [],
  };
  const initialGameState: Game = {
    id: "",
    gameNumber: 0,
    home: { id: "", name: "" },
    away: { id: "", name: "" },
    awayGols: 0,
    homeGols: 0,
  };
  const [gameDayState, setGameDayState] =
    useState<GameDay>(initialGameDayState);
  const [gameState, setGameState] = useState<Game>(initialGameState);
  const [isLigaSet, setIsLigaSet] = useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [gamesLoaderOpen, setGamesLoaderOpen] = useState<boolean>(false);

  const [ligas, teams, isLoading, error] = useLoadAutocompleteFields();

  if (!isLigaSet && ligas?.length != 0) {
    setIsLigaSet(true);
    const ligaId = searchParams.get("liga_id")?.toString();
    const liga = ligas?.find((liga) => liga.id === ligaId);
    liga && setGameDayState({ ...gameDayState, ["liga"]: liga });
  }

  useEffect(() => {
    if (error) {
      console.error(error);
      enqueueSnackbar(`Error loading data`, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameDayState({ ...gameDayState, [name]: value });

    const params = new URLSearchParams(searchParams);
    params.delete("game_day_id");
    replace(`${pathname}?${params.toString()}`);
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

  const gamesLoadOpen = () => {
    setGamesLoaderOpen(true);
  };

  const gamesLoadClose = () => {
    setGamesLoaderOpen(false);
  };

  const gamesLoad = (games: Game[]) => {
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

    const response = await fetch(`/api/game-days`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      enqueueSnackbar(`Game Day created successfully`, { variant: "success" });
      setGameDayState(initialGameDayState);
      setIsLigaSet(false);
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
          <Grid container spacing={2} p={2}>
            <Grid xs={12} md={9}>
              <AutocompleteField
                name="liga"
                label="Liga"
                options={ligas}
                disabled={isLoading || isDisabled}
                value={
                  gameDayState?.liga?.id === "" ? null : gameDayState?.liga
                }
                handleChange={handleChange}
              />
            </Grid>
            <Grid xs={12} md={3}>
              <FormControl fullWidth>
                <TextField
                  name="round"
                  label="Round"
                  type="number"
                  value={gameDayState?.round === 0 ? null : gameDayState?.round}
                  disabled={isLoading || isDisabled}
                  onChange={handleChange}
                  inputProps={{ "data-testid": "round" }}
                />
              </FormControl>
            </Grid>

            <Grid xs={12} md={5}>
              <AutocompleteField
                name="home"
                label="Home"
                options={teams}
                disabled={isLoading || isDisabled}
                value={gameState?.home?.id === "" ? null : gameState?.home}
                handleChange={handleChangeGame}
              />
            </Grid>
            <Grid xs={12} md={5}>
              <AutocompleteField
                name="away"
                label="Away"
                options={teams}
                disabled={isLoading || isDisabled}
                value={gameState?.away?.id === "" ? null : gameState?.away}
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
                <Button
                  color="warning"
                  variant="contained"
                  name="games-load"
                  onClick={gamesLoadOpen}
                  disabled={isLoading || isDisabled}
                >
                  Load Games
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <GamesLoader
        open={gamesLoaderOpen}
        gamesLoad={gamesLoad}
        gamesLoadClose={gamesLoadClose}
      />
    </Box>
  );
}

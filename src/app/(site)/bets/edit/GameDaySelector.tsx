"use client";

import { GameDay } from "@/frontend/types/GameDay";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  TextField,
} from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent } from "react";

export type GameDaysWithoutLiga = Omit<GameDay, "liga">;

export function GameDaySelector({
  game_days,
}: {
  game_days: GameDaysWithoutLiga[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getOptionLabel = (option: GameDaysWithoutLiga): string =>
    option.round.toString();
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: GameDaysWithoutLiga
  ) => (
    <li {...props} key={option.id}>
      {option.round}
    </li>
  );
  const isOptionEqualToValue = (
    option: GameDaysWithoutLiga,
    value: GameDaysWithoutLiga
  ) => option.id === value.id;

  const onChange = (
    _event: SyntheticEvent<Element, Event>,
    value: GameDaysWithoutLiga | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<GameDaysWithoutLiga> | undefined
  ) => {
    const liga_id = searchParams.get("liga_id");
    const game_day_id = value?.id;

    setSearchParams(router, liga_id, game_day_id);
  };

  function setSearchParams(
    router: AppRouterInstance,
    liga_id: string | undefined | null,
    game_day_id: string | undefined | null
  ) {
    let path = `/bets/edit`;
    const urlSearchParams = new URLSearchParams();

    if (liga_id) {
      urlSearchParams.append("liga_id", liga_id);
    }

    if (game_day_id) {
      urlSearchParams.append("game_day_id", game_day_id);
    }

    if (urlSearchParams.toString()) {
      path += `?${urlSearchParams.toString()}`;
    }

    router.push(path);
  }

  const selectedGameDayId = searchParams.get("game_day_id");
  const selectedGameDay = game_days.find(
    (gameDay) => gameDay.id === selectedGameDayId
  );
  return (
    <Autocomplete
      clearOnEscape
      options={game_days}
      onChange={onChange}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
      value={selectedGameDay ?? null}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={(params) => <TextField {...params} label="Game Day" />}
    />
  );
}

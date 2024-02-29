"use client";

import { Better } from "@/frontend/types/Better";
import { Liga } from "@/frontend/types/Liga";
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter, useSearchParams } from "next/navigation";
import { SyntheticEvent } from "react";

export function BetterDaySelector({ betters }: { betters: Better[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getOptionLabel = (option: Better): string => option.name as string;
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: Better
  ) => (
    <li {...props} key={option.id}>
      {option.name}
    </li>
  );
  const isOptionEqualToValue = (option: Better, value: Better) =>
    option.id === value.id;

  const onChange = (
    _event: SyntheticEvent<Element, Event>,
    value: Better | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<Liga> | undefined
  ) => {
    const liga_id = searchParams.get("liga_id");
    const game_day_id = searchParams.get("game_day_id");
    const better_id = value?.id;
    setSearchParams(router, liga_id, game_day_id, better_id);
  };

  function setSearchParams(
    router: AppRouterInstance,
    liga_id: string | undefined | null,
    game_day_id?: string | undefined | null,
    better_id?: string | undefined | null
  ) {
    let path = `/bets/edit`;
    const urlSearchParams = new URLSearchParams();

    if (liga_id) {
      urlSearchParams.append("liga_id", liga_id);
    }

    if (game_day_id) {
      urlSearchParams.append("game_day_id", game_day_id);
    }

    if (better_id) {
      urlSearchParams.append("better_id", better_id);
    }

    if (urlSearchParams.toString()) {
      path += `?${urlSearchParams.toString()}`;
    }

    router.push(path);
  }

  const selectedBetterId = searchParams.get("better_id");
  const selectedBetter = betters.find(
    (better) => better.id === selectedBetterId
  );
  return (
    <Grid xs={12} md={9}>
      <Autocomplete
        clearOnEscape
        options={betters}
        onChange={onChange}
        renderOption={renderOption}
        value={selectedBetter ?? null}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => <TextField {...params} label="Better" />}
      />
    </Grid>
  );
}

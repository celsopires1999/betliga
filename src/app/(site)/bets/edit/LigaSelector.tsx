"use client";

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

export function LigaSelector({ ligas }: { ligas: Liga[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getOptionLabel = (option: any): string => option.name as string;
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: any
  ) => (
    <li {...props} key={option.id}>
      {option.name}
    </li>
  );
  const isOptionEqualToValue = (option: any, value: any) =>
    option.id === value.id;

  const onChange = (
    _event: SyntheticEvent<Element, Event>,
    value: Liga | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<Liga> | undefined
  ) => {
    const liga_id = value?.id;
    searchBetter(router, liga_id);
  };

  function searchBetter(
    router: AppRouterInstance,
    liga_id: string | undefined | null
  ) {
    let path = `/bets/edit`;
    const urlSearchParams = new URLSearchParams();

    if (liga_id) {
      urlSearchParams.append("liga_id", liga_id);
    }

    if (urlSearchParams.toString()) {
      path += `?${urlSearchParams.toString()}`;
    }

    router.push(path);
  }

  const selectedLigaId = searchParams.get("liga_id");
  const selectedLiga = ligas.find((liga) => liga.id === selectedLigaId);
  return (
    <Grid xs={12} md={9}>
      <Autocomplete
        clearOnEscape
        options={ligas}
        onChange={onChange}
        renderOption={renderOption}
        value={selectedLiga ?? null}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => <TextField {...params} label="Liga" />}
      />
    </Grid>
  );
}

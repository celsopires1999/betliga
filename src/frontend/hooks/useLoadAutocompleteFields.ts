import useSWR from "swr";
import { Liga } from "../types/Liga";
import { Team } from "../types/Team";
import { fetcher } from "../utils/http";

export const useLoadAutocompleteFields = () => {
  const {
    data: teams,
    error: TeamsError,
    isLoading: TeamsIsLoading,
  } = useSWR<Team[]>(`/api/teams`, fetcher, {
    fallbackData: [],
  });
  const {
    data: ligas,
    error: LigasError,
    isLoading: LigasIsLoading,
  } = useSWR<Liga[]>(`/api/ligas`, fetcher, {
    fallbackData: [],
  });

  const isLoading = LigasIsLoading || TeamsIsLoading;
  const error = LigasError ? LigasError : TeamsError;

  return [ligas, teams, isLoading, error] as const;
};

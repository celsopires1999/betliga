import useSWR from "swr";
import { Liga, Team } from "../types";
import { fetcher } from "../utils/http";

export const useLoadAutocompleteFields = () => {
  const {
    data: teams,
    error: TeamsError,
    isLoading: TeamsIsLoading,
  } = useSWR<Team[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/teams`, fetcher, {
    fallbackData: [],
  });
  const {
    data: ligas,
    error: LigasError,
    isLoading: LigasIsLoading,
  } = useSWR<Liga[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/ligas`, fetcher, {
    fallbackData: [],
  });

  const isLoading = LigasIsLoading || TeamsIsLoading;
  const error = LigasError ? LigasError : TeamsError;

  return [ligas, teams, isLoading, error] as const;
};

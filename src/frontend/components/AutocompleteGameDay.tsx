import { Autocomplete, TextField } from "@mui/material";
import { GameDay } from "../types/GameDay";

export type AutocompleteGameDayProps = {
  name: string;
  label: string;
  options?: GameDay[];
  value: GameDay | null | undefined;
  disabled: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AutocompleteGameDay(props: AutocompleteGameDayProps) {
  const getOptionLabel = (option: GameDay): string => option.round.toString();
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: GameDay
  ) => (
    <li {...props} key={option.id}>
      {option.round}
    </li>
  );
  const isOptionEqualToValue = (option: GameDay, value: GameDay) =>
    option.id === value.id;

  const onChange = (_: any, value: GameDay | null) => {
    props.handleChange({ target: { name: props.name, value } } as any);
  };

  return (
    <>
      <Autocomplete
        disablePortal
        value={props.value}
        onChange={onChange}
        renderOption={renderOption}
        disabled={props.disabled}
        options={props.options ?? []}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />
    </>
  );
}

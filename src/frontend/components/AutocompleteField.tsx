import { Autocomplete, TextField } from "@mui/material";
import { Liga, Team } from "../types";

type Field = Liga | Team;

export type AutocompleteFieldProps = {
  name: string;
  label: string;
  options?: Field[];
  value: Field | null | undefined;
  disabled: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AutocompleteField(props: AutocompleteFieldProps) {
  const getOptionLabel = (option: Field): string => option.name as string;
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: Field
  ) => (
    <li {...props} key={option.id}>
      {option.name}
    </li>
  );
  const isOptionEqualToValue = (option: Field, value: Field) =>
    option.id === value.id;

  const onChange = (_: any, value: Field | null) => {
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

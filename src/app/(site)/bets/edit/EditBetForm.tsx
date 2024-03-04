"use client";
import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { performAction } from "./server-actions/perform-action";

const initialState = {
  success: undefined,
  message: undefined,
};

export function EditBetForm({ children }: { children: React.ReactNode }) {
  const [state, formAction] = useFormState(performAction, initialState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (state.success === false) {
      enqueueSnackbar(state.message, { variant: "error" });
    }
    if (state.success === true) {
      enqueueSnackbar(state.message, { variant: "success" });
    }
  }, [state, enqueueSnackbar]);

  return (
    <Box component={"form"} action={formAction}>
      {children}
    </Box>
  );
}

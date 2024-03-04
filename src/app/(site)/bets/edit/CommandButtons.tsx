"use client";

import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export function CommandButtons() {
  const { pending } = useFormStatus();
  return (
    <Box display="flex" gap={2}>
      <Button name="back" variant="contained" href="/" LinkComponent={Link}>
        Back
      </Button>
      <Button
        name="save"
        type="submit"
        variant="contained"
        color="secondary"
        disabled={pending}
      >
        {pending ? "Loading" : "Save"}
      </Button>
    </Box>
  );
}

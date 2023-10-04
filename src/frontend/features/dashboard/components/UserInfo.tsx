"use client";

import { Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session } = useSession();
  return (
    <>
      <Typography>Name: {session?.user?.name}</Typography>
      <Typography>Email: {session?.user?.email}</Typography>
      <Button
        fullWidth
        name="logout"
        variant="contained"
        color="secondary"
        onClick={() => signOut()}
      >
        Log Out
      </Button>
    </>
  );
}

"use client";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, IconButton, Toolbar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";

export function Header({
  toggle,
  mode,
  handleDrawerToggle,
}: {
  toggle: () => void;
  mode: string;
  handleDrawerToggle?: () => void;
}) {
  const { data: session } = useSession();
  return (
    <Box>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ ml: 1 }} onClick={toggle} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {session && (
          <Button color="inherit" onClick={() => signOut()}>
            Logout
          </Button>
        )}
      </Toolbar>
    </Box>
  );
}

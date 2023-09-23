"use client";

import { AppBar } from "@mui/material";
import { Header } from "./Header";
import { ResponsiveDrawer } from "./ResponsiveDrawer";

import { useState } from "react";
import { useAppTheme } from "../hooks/useAppTheme";

const drawerWidth = 240;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTheme, toggleCurrentTheme] = useAppTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Header
          handleDrawerToggle={handleDrawerToggle}
          toggle={toggleCurrentTheme}
          mode={currentTheme.palette.mode === "dark" ? "dark" : "light"}
        />
      </AppBar>
      <ResponsiveDrawer open={mobileOpen} onClose={handleDrawerToggle} />
    </>
  );
}

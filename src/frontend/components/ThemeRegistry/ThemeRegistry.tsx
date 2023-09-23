"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { SnackbarProvider } from "notistack";
import { useAppTheme } from "@/frontend/hooks/useAppTheme";
import { AppBar, Box, Container } from "@mui/material";
import { Header } from "../Header";
import { ResponsiveDrawer } from "../ResponsiveDrawer";

const drawerWidth = 240;

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentTheme, toggleCurrentTheme] = useAppTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={currentTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppBar
            position="fixed"
            color="inherit"
            elevation={3}
            sx={{
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
            }}
          >
            <Header
              handleDrawerToggle={handleDrawerToggle}
              toggle={toggleCurrentTheme}
              mode={currentTheme.palette.mode === "dark" ? "dark" : "light"}
            />
          </AppBar>
          <ResponsiveDrawer open={mobileOpen} onClose={handleDrawerToggle} />
          <SnackbarProvider
            autoHideDuration={2000}
            maxSnack={3}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Container maxWidth="lg" sx={{ color: "inherit", my: 12 }}>
              {children}
            </Container>
          </SnackbarProvider>
        </Box>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

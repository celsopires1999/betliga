"use client";

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// const defaultTheme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#FFCD00",
//       contrastText: "#242526",
//     },
//     secondary: {
//       main: "#e50914",
//     },
//     background: {
//       default: "#242526",
//     },
//   },
//   typography: {
//     fontFamily: roboto.style.fontFamily,
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         "html, body": {
//           minHeight: "100vh",
//           display: "flex",
//           flex: 1,
//           flexDirection: "column",
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         colorPrimary: {
//           backgroundColor: "#FFCD00",
//           color: "#242526",
//         },
//       },
//     },
//   },
// });

export const darkTheme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },

  palette: {
    background: {
      default: "#222222",
    },
    mode: "dark",
    primary: { main: "#f5f5f1" },
    secondary: { main: "#e50914" },
    text: { primary: "#f5f5f1" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#222222",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    background: {
      default: "#f5f5f1",
    },
    mode: "light",
    primary: { main: "#222222" },
    secondary: { main: "#e50914" },
    text: { primary: "#222222" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#f5f5f1",
        },
      },
    },
  },
});

// export default defaultTheme;

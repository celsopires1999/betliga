"use client";

import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type LoginState = {
  email: string;
  password: string;
};
export function LoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const initialLoginState: LoginState = {
    email: "",
    password: "",
  };

  const [loginState, setLoginState] = useState<LoginState>(initialLoginState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginState({ ...loginState, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);

    try {
      const response = await signIn("credentials", {
        email: loginState.email,
        password: loginState.password,
        redirect: false,
      });

      if (response?.error) {
        enqueueSnackbar(`Invalid credentials`, {
          variant: "error",
        });
        setIsDisabled(false);
        return;
      }
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }

    setIsDisabled(false);
  }

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} p={2}>
          <Grid xs={12}>
            <Typography variant="h6">Enter the details</Typography>
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="email"
                label="Email"
                type="text"
                value={loginState.email}
                disabled={isDisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="password"
                label="Password"
                type="password"
                value={loginState.password}
                disabled={isDisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <Box display="flex" gap={2}>
              <Button
                fullWidth
                name="save"
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isDisabled}
              >
                Login
              </Button>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Typography align="right">
              Do not have an account? <Link href={"/register"}>Register</Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

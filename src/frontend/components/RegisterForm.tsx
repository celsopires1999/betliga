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

type RegisterState = {
  name: string;
  email: string;
  password: string;
};
export function RegisterForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const initialRegisterState: RegisterState = {
    name: "",
    email: "",
    password: "",
  };

  const [registerState, setRegisterState] =
    useState<RegisterState>(initialRegisterState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterState({ ...registerState, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsDisabled(true);

    if (
      !registerState.name ||
      !registerState.email ||
      !registerState.password
    ) {
      enqueueSnackbar(`All fields are necessary`, {
        variant: "error",
      });
      setIsDisabled(false);
      return;
    }

    const data = {
      name: registerState.name,
      email: registerState.email,
      password: registerState.password,
    };

    const response = await fetch(`/api/register`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const { code } = await response.json();
      if (code === 12) {
        enqueueSnackbar(`User already exists`, {
          variant: "error",
        });
        setIsDisabled(false);
        return;
      }
      enqueueSnackbar(`User registered successfully`, { variant: "success" });
      setRegisterState(initialRegisterState);
      router.push("/");
    } else {
      console.error(
        `There was an error on user registration. Status: ${response.status} - Message: ${response.statusText}`
      );
      enqueueSnackbar(`User not registered: ${response.statusText}`, {
        variant: "error",
      });
    }

    setIsDisabled(false);
  }

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} p={2}>
          <Grid xs={12}>
            <Typography variant="h6">Register</Typography>
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="name"
                label="Full Name"
                type="text"
                value={registerState.name}
                disabled={isDisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <FormControl fullWidth>
              <TextField
                name="email"
                label="Email"
                type="text"
                value={registerState.email}
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
                value={registerState.password}
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
                Register
              </Button>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Typography align="right">
              Already have an account? <Link href={"/"}>Login</Link>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

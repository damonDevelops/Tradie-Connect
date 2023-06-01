//Sign In Page for all users

//Import statements
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { checkRole } from "../components/hooks/checkUser";

//theme for the page
const theme = createTheme();

export default function SignIn() {
  //time for loading backdrop
  const timer = React.useRef();

  //state variables for authentication
  const [authenticateEmail, setAuthenticateEmail] = useState("");
  const [authenticatePassword, setAuthenticatePassword] = useState("");

  //state variables for alerts
  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const [loginFailAlert, setLoginFailAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //variable for fetching current user to store in current user context
  //const { fetchCurrentUser } = useCurrentUser(); // part of current user context, maybe delete
  const router = useRouter();

  //function to handle the alerts
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setLoginFailAlert(false);
  };

  //function to handle the timer
  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  //function to handle the authentication
  const handleSubmit = (e) => {
    e.preventDefault();

    // Open the loading wheel
    setBackdropOpen(true);

    // Make the axios request
    axios
      .post("http://localhost:8080/api/auth/SignIn", {
        email: authenticateEmail,
        password: authenticatePassword,
      })
      .then((response) => {
        // Set the JWT cookie and redirect to the dashboard
        Cookies.set("JWT", response.data.token);

        // If the response is successful, open the wheel for a bit
        if (response.status === 200) {
          setBackdropOpen(true);
          timer.current = window.setTimeout(() => {
            setBackdropOpen(false);
          }, 10000);
        }

        if (checkRole() === "ROLE_SYSTEM_ADMIN") {
          router.push("/Admin");
        } else if (checkRole() === "ROLE_CUSTOMER") {
          router.push("/Customer");
        } else {
          router.push("/Service-Provider");
        }
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          setAlertMessage("Invalid Login Details");
        } else {
          setAlertMessage("Error: " + error);
        }
        // Close loading
        setBackdropOpen(false);
        // If the response is unsuccessful, open the alert
        setLoginFailAlert(true);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={(event) => setAuthenticateEmail(event.target.value)}
              value={authenticateEmail}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={(event) => setAuthenticatePassword(event.target.value)}
              value={authenticatePassword}
              id="password"
              autoComplete="current-password"
            />
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={backdropOpen}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item>
                <Link href="./SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={loginFailAlert}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

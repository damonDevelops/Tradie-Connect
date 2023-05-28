// Home content for the service provider
// Shows the available requests and buttons to various pages

//import statements 
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import AvailableRequest from "../Requests/AvailableRequests";
import Grid from "@mui/material/Grid";
import Link from "next/link";

// theme for the page
const theme = createTheme();

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Grid container spacing={2}>
      <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: "auto",
              marginTop: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Current Requests{" "}
            </Typography>
            <br />
            <Link href="/Service-Provider/Current-Requests" passHref legacyBehavior color="inherit">
            <Button
              variant="contained"
              sx={{ width: "100%" }}
            >
              Current Requests{" "}
            </Button>
            </Link>
            
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: "auto",
              marginTop: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Finished Requests{" "}
            </Typography>
            <br />
            <Link href="/Service-Provider/Finished-Requests" passHref legacyBehavior color="inherit">
            <Button
              variant="contained"
              sx={{ width: "100%" }}
            >
              Finished Requests{" "}
            </Button>
            </Link>
            
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              height: "auto",
              marginTop: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Reports{" "}
            </Typography>
            <br />
            <Link href="/Service-Provider/Report" passHref legacyBehavior color="inherit">
            <Button
              variant="contained"
              sx={{ width: "100%" }}

            >
              Reports{" "}
            </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{mt: 3}}>
        <AvailableRequest />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

// import statements
import * as React from "react";
import CurrentRequest from "../../../components/Requests/CustomerCurrentRequest";
import CustomerDash from "../../../components/Dashboard/CustomerDashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function CurrentRequestScreen() {
  const theme = createTheme();
  return (
    <CustomerDash>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "auto",
          }}
        >
          <Typography sx={{overflow: "auto"}}  variant="h4" gutterBottom>
            Current Requests
          </Typography>
          <CurrentRequest />
        </Paper>
      </ThemeProvider>
    </CustomerDash>
  );
}

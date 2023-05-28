// Component to display service providers on the admin home page
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ServiceProvidersTable from "./ServiceProvidersTable";

const theme = createTheme();

export default function ServiceProviders() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Service Providers
        </Typography>
        <ServiceProvidersTable />
      </Paper>
    </ThemeProvider>
  );
}

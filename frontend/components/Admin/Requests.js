//Component to show the requests on the admin home page
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RequestsTable from "./RequestsTable";

const theme = createTheme();
export default function Requests() {
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
        Requests
      </Typography>
      <RequestsTable />
      </Paper>
      
    </ThemeProvider>
  );
}

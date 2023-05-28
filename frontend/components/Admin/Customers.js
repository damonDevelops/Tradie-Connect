// Component for code splitting to load Customers on the dashboard
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomersTable from "./CustomersTable";

const theme = createTheme();

export default function Customers() {
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
        Customers
      </Typography>
      <CustomersTable/>
      </Paper>
    </ThemeProvider>
  );
}


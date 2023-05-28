import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";



const theme = createTheme();

export default function DashboardPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 700,
                  }}
                >
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>

      </Paper>
    </ThemeProvider>
  );
}

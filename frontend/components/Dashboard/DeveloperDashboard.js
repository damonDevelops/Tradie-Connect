// Main Developer Dashboard Page is for developers to access different links to the website.


// import statements
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Paper } from "@mui/material";

const theme = createTheme();

const Developer = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          {/* Title */}
          <Typography variant="h6" color="inherit" noWrap>
            Developer Homepage
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Developer Homepage
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              A place for developers to access different links to the website.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" href="./Customer">
                Customer Dashboard
              </Button>
              <Button variant="contained" href="./Service-Provider">
                Tradie Dashboard
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item sm={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 120,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  Sign Up
                </Typography>
                <Button variant="contained" align="center" href="./SignUp">
                  Sign Up
                </Button>
              </Paper>
            </Grid>
            <Grid item sm={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 120,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  Sign In
                </Typography>
                <Button variant="contained" align="center" href="./SignIn">
                  Sign In
                </Button>
              </Paper>
            </Grid>
            <Grid item sm={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 120,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  Test Features
                </Typography>
                <Button
                  variant="contained"
                  align="center"
                  href="./ReviewTest"
                >
                  Test Review Page
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
};

export default Developer;

//export default withAuth(Developer, ["Admin"]);

//page for when a user tries to access a page they aren't meant to
//Simply displays a message with a button to return them to the sign in page

//imports
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Fab } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid } from "@mui/material";
import Link from "next/link";

export default function Unauthorized() {
  const mdTheme = createTheme();

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          height={"100%"}
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          backgroundColor="	#000007"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <Typography
              variant="h1"
              component="div"
              align="center"
              sx={{
                marginLeft: 5,
                marginRight: 5,
                flexGrow: 1,
                color: "white",
              }}
            >
              401 - Unauthorized
            </Typography>
            <Typography
              variant="h3"
              component="div"
                align="center"
              sx={{
                marginLeft: 5,
                marginRight: 5,
                flexGrow: 1,
                color: "white",
              }}
            >
              Hey! What are you doing here!? Head back to the Sign In page and try again!
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Link href="/SignIn">
              <Fab
                variant="extended"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "#1976d2",
                  fontSize: "20px",
                  color: "white",
                  marginTop: "20px",
                  ":hover": {
                    bgcolor: "#092848",
                    color: "white",
                  },
                }}
              >
                Back to Sign In
              </Fab>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

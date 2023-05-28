//import statements
import { useEffect, useState } from "react";
import ServiceProviderSignUp from "../components/SignUp/ServiceProviderSignUp";
import CustomerSignUp from "../components/SignUp/CustomerSignUp";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

//returns the copyright section at the bottom of the page
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        TradieConnect
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

//creates constant theme
const theme = createTheme();

//sign up function
export default function SignUp() {
  //state variables for account
  const [account_type, setAccountType] = React.useState("");

  //state variables for content visibility
  const [customerContentVisible, setCustomerContentVisible] = useState(false);
  const [tradieContentVisible, setTradieContentVisible] = useState(false);

  const [data, setData] = useState([]);

  //useEffect to set content visibility
  useEffect(() => {
    account_type === "Customer"
      ? setCustomerContentVisible(true)
      : setCustomerContentVisible(false);
    account_type === "Tradie"
      ? setTradieContentVisible(true)
      : setTradieContentVisible(false);
  }, [account_type]);

  //handles change in account type to display different data to tradie or customer
  const handleChange = (event) => {
    setAccountType(event.target.value);
  };

  //returns the sign up page
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
            Tradie Connect
          </Typography>
          <Typography component="h2" variant="h5">
            Sign Up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Account Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={account_type}
                  label="Account Type"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value={"Customer"}>Customer</MenuItem>
                  <MenuItem value={"Tradie"}>Service Provider</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {customerContentVisible && <CustomerSignUp />}
              {tradieContentVisible && <ServiceProviderSignUp />}
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

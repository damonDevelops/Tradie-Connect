// Main Admin Dashboard Home Page
// contains tables for customers, service providers, and requests
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomersTable from "../Admin/CustomersTable";
import ServiceProvidersTable from "../Admin/ServiceProvidersTable";
import RequestsTable from "../Admin/RequestsTable";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { useEffect } from "react";

const theme = createTheme();

export default function Home() {

  //useEffect to allow the admin to generate test data for the website
  useEffect(() => {
    const instance = axios.create({
      withCredentials: true,
    });

    const dataURL = "http://localhost:8080/api/customers/all";
    instance.get(dataURL).then((response) => {
      console.log(response.data.length)
      if (response.data.length >= 100) {
        setDisabled(true);
        setButtonLabel("Data Already Generated");
      } else {
        setDisabled(false);
        setButtonLabel("Generate Data");
      }
    });
  }, []);

  //state variables for data button
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [buttonLabel, setButtonLabel] = React.useState("Generate Data");

  //function to generate data
  const generateData = async () => {
    setLoading(true);
    const instance = axios.create({
      withCredentials: true,
    });
    
    const dataURL = "http://localhost:8080/admin/generateTestData";
    try {
      await instance.post(dataURL);
      setLoading(false);
      setButtonLabel("Data Generated Successfully");
      setDisabled(true);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
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
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <Divider />
        <br />
        <LoadingButton
          sx={{ width: "20%", marginLeft: "auto", marginBottom: 1 }}
          onClick={generateData}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          disabled={disabled}
        >
          {buttonLabel}
        </LoadingButton>
        <Divider />
        <br />
        <Typography variant="h4" gutterBottom>
          Customers
        </Typography>
        <CustomersTable />
        <br />
        <Link href="/Admin/Customers" passHref legacyBehavior color="inherit">
          <Button
            variant="contained"
            sx={{ width: "30%", marginLeft: "auto" }}
            color="primary"
            href="/admin/customers"
          >
            View All Customers
          </Button>
        </Link>
        <br />
        <Divider />
        <br />
        <Typography variant="h4" gutterBottom>
          Service Providers
        </Typography>
        <ServiceProvidersTable />
        <br />
        <Link
          href="/Admin/ServiceProviders"
          passHref
          legacyBehavior
          color="inherit"
        >
          <Button
            variant="contained"
            sx={{ width: "30%", marginLeft: "auto" }}
            color="primary"
            href="/admin/customers"
          >
            View All Providers
          </Button>
        </Link>
        <br />
        <Divider />
        <br />
        <Typography variant="h4" gutterBottom>
          Requests
        </Typography>
        <RequestsTable />
        <br />
        <Link href="/Admin/Requests" passHref legacyBehavior color="inherit">
          <Button
            variant="contained"
            sx={{ width: "30%", marginLeft: "auto" }}
            color="primary"
            href="/admin/customers"
          >
            View All Requests
          </Button>
        </Link>
        <br />
      </Paper>
    </ThemeProvider>
  );
}

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useState } from "react";
import { useEffect } from "react";

import Link from "next/link";

import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import useFetchData from "../hooks/fetchData";
import axios from "axios";

// for displaying data:
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import DoneIcon from "@mui/icons-material/Done";

const theme = createTheme();

export default function AvailableRequest() {
  const fetchURL = "http://localhost:8080/api/service-providers";

  // state variables for functions
  const { data: responseData } = useFetchData(fetchURL); // fetches currently logged in service-provider
  const [serviceRequests, setRequests] = useState([]);

  const instance = axios.create({
    withCredentials: true,
  });

  // use effect checks if responseData and qualified service requests exists
  // then uses the ID's from qualified service requests to map individual objects into an array
  // using the service-request + id to get the individual service request object
  useEffect(() => {
    const fetchData = async () => {
      if (responseData && responseData.qualifiedServiceRequests) {
        const objectPromise = responseData.qualifiedServiceRequests.map((id) =>
          instance.get("http://localhost:8080/api/service-requests/" + id)
        );
        const requests = await Promise.all(objectPromise);
        setRequests(requests.map((response) => response.data));
      }
    };

    fetchData();
  }, [responseData]);

  // maps service requests and only includes the data we need to show in a row
  const rows = serviceRequests.map(
    ({
      id,
      serviceType,
      status,
      scheduledStartDate,
      scheduledEndDate,
      cost,
      customer: {
        suburb: { name: suburbName },
      },
      applicants,
    }) => ({
      id,
      serviceType,
      status,
      scheduledStartDate,
      scheduledEndDate,
      cost,
      customer: { suburbName },
      serviceProviderIds: applicants.map(
        (applicant) => applicant.serviceProvider.id
      ),
    })
  );

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
        <Typography sx={{ overflow: "auto" }} variant="h4" gutterBottom>
          Available Requests
        </Typography>
        <RequestTable data={rows} />
      </Paper>
    </ThemeProvider>
  );
}

function RequestTable({ data }) {
  // state variables for functions
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Router = useRouter();

  // function for changing pages on the table
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // handler for changing the rows on the table
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [id, setId] = React.useState(null);

  const instance = axios.create({
    withCredentials: true,
  });

  // use effect to get service-providers and check if logged in service provider
  // has already applied for specific service request
  useEffect(() => {
    const fetchServiceProvider = () => {
      instance
        .get("http://localhost:8080/api/service-providers")
        .then((response) => {
          const serviceProviderId = response.data.id;
          setId(serviceProviderId);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchServiceProvider();
  }, []);

  // styles for the header row
  const headerStyles = {
    textAlign: "center",
    fontWeight: "bold",
  };

  // styles for cell content
  const cellStyles = {
    textAlign: "center",
  };

  // variable uses data.slice to cut the information in the table
  // based on the rows per page and page number
  const rowsToDisplay = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minwidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyles}>Work Type</TableCell>
            <TableCell sx={headerStyles}>Start Date</TableCell>
            <TableCell sx={headerStyles}>Finish Date</TableCell>
            <TableCell sx={headerStyles}>Location (Suburb)</TableCell>
            <TableCell sx={headerStyles}>Pays ($)</TableCell>
            <TableCell sx={headerStyles}>Applied?</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToDisplay.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyles}>
                {row.serviceType
                  ? capitaliseWords(row.serviceType)
                  : row.serviceType}
              </TableCell>

              <TableCell sx={cellStyles}>
                {row.scheduledStartDate
                  ? formatDate(row.scheduledStartDate)
                  : row.scheduledStartDate}
              </TableCell>
              <TableCell sx={cellStyles}>
                {row.scheduledEndDate
                  ? formatDate(row.scheduledEndDate)
                  : row.scheduledEndDate}
              </TableCell>
              <TableCell sx={{ width: "20%", textAlign: "center" }}>
                {row.customer.suburbName}
              </TableCell>
              <TableCell sx={cellStyles}>{"$" + row.cost}</TableCell>
              <TableCell sx={cellStyles}>
                {row.serviceProviderIds.includes(id) ? (
                  <DoneIcon style={{ color: "green" }} />
                ) : null}
              </TableCell>
              <TableCell>
                <Link
                  href={{
                    pathname: `/Service-Provider/ViewRequest/[id]`,
                    query: { fromRequests: true, serviceProvider: true },
                  }}
                  as={`/Service-Provider/ViewRequest/${row.id}`}
                  passHref
                  legacyBehavior
                >
                  <Button component="a" variant="outlined">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

// function takes string and capitalises the first letter of each word
// and lower cases every other word
function capitaliseWords(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// takes date in format of array[YYYY, MM, DD] and changes it to DD/MM/YYYY
function formatDate(date) {
  return date[2] + "/" + date[1] + "/" + date[0];
}

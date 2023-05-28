import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import Link from "next/link";

import Button from "@mui/material/Button";
import { useRouter } from "next/router";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

const theme = createTheme();

export default function FinishedRequests() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const instance = axios.create({
    withCredentials: true,
  });

  const fetchData = async () => {
    try {
      const response = await instance.get(
        "http://localhost:8080/api/service-requests/user-requests",
        {
          responseType: "json",
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // maps the data from the request into a rows array with only the data required to be shown
  const rows = data
    .filter((row) => row.status == "COMPLETED") // filters only the completed ones
    .map(
      ({
        id,
        serviceType,
        status,
        scheduledStartDate,
        scheduledEndDate,
        cost,
        completedOn,
      }) => ({
        id,
        serviceType,
        status,
        scheduledStartDate,
        scheduledEndDate,
        cost,
        completedOn,
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
        <Typography sx={{overflow: "auto"}}  variant="h4" gutterBottom>
          Finished Requests
        </Typography>
        <RequestTable data={rows} />
      </Paper>
    </ThemeProvider>
  );
}

function RequestTable({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const Router = useRouter();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // styles for the header row
  const headerStyles = {
    textAlign: "center",
    fontWeight: "bold",
  };

  // styles for cell content
  const cellStyles = {
    textAlign: "center",
  };

  const rowsToDisplay = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minwidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyles}>Service Request (ID)</TableCell>
            <TableCell sx={headerStyles}>Work Type</TableCell>
            <TableCell sx={headerStyles}>Work Status</TableCell>
            <TableCell sx={headerStyles}>Start Date</TableCell>
            <TableCell sx={headerStyles}>Expected Finish Date</TableCell>
            <TableCell sx={headerStyles}>Actual Completion Date</TableCell>
            <TableCell sx={headerStyles}>Paid ($)</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToDisplay.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: "20%", textAlign: "center" }}>
                {row.id}
              </TableCell>
              <TableCell sx={cellStyles}>
                {row.serviceType
                  ? capitaliseWords(row.serviceType)
                  : row.serviceType}
              </TableCell>
              <TableCell sx={cellStyles}>
                {row.status ? capitaliseWords(row.status) : row.status}
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
              <TableCell sx={cellStyles}>
                {row.completedOn
                  ? formatDate(row.completedOn)
                  : row.completedOn}
              </TableCell>
              <TableCell sx={cellStyles}>{"$" + row.cost}</TableCell>
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

function capitaliseWords(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date) {
  return date[2] + "/" + date[1] + "/" + date[0];
}

// component for request table which is used across multiple pages of admin

// import statements
import * as React from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import { Typography } from "@mui/material";

export default function ServiceProviders() {
  // state variable to store the data from the request
  const [data, setData] = useState([]);
  const [didDataFetch, setDidDataFetch] = React.useState(true);

  // state variable to store the sort model
  const [sortModel, setSortModel] = React.useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const instance = axios.create({
    withCredentials: true,
  });

  // function to fetch the data from the request
  const fetchData = async () => {
    await instance
      .get("http://localhost:8080/api/service-requests", {
        responseType: "json",
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setDidDataFetch(false);
      });
  };

  // maps the data from the request into a rows array with only the data required to be shown
  const rows = data.map(
    ({
      id,
      serviceType,
      status,
      cost,
      scheduledStartDate,
      scheduledEndDate,
    }) => ({
      id,
      status,
      serviceType,
      cost,
      scheduledStartDate,
      scheduledEndDate,
    })
  );

  if (didDataFetch) {
    return <RequestTable data={rows} />;
  } else {
    return (
      <Typography variant="h6" gutterBottom>
        Could not fetch Customer Data
      </Typography>
    );
  }
}

function RequestTable({ data }) {
  // styles for the header row
  const headerStyles = {
    textAlign: "center",
    fontWeight: "bold",
  };

  // styles for cell content
  const cellStyles = {
    textAlign: "center",
  };

  //sets the page and rows per page
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //handles change of page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //handles change of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //const to show how many rows to display
  const rowsToDisplay = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minwidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyles}>Request (ID)</TableCell>
            <TableCell sx={headerStyles}>Service Type</TableCell>
            <TableCell sx={headerStyles}>Status</TableCell>
            <TableCell sx={headerStyles}>Cost</TableCell>
            <TableCell sx={headerStyles}>Start Date</TableCell>
            <TableCell sx={headerStyles}>End Date</TableCell>
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
              <TableCell sx={cellStyles}>{row.cost}</TableCell>
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

function formatDate(date) {
  return date[2] + "/" + date[1] + "/" + date[0];
}

function capitaliseWords(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

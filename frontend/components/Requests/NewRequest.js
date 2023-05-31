//Component for the customer to make a new request

//import statements
import * as React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import { Divider } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect } from "react";
import Link from "next/link";
import { Stack } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const theme = createTheme();

function returnCost() {
  <Typography sx={{ mt: 2 }} variant="h6" gutterBottom>
    Work Description
  </Typography>;
}

export default function NewRequest() {
  const instance = axios.create({
    withCredentials: true,
  });

  //useEffect to fetch the data
  useEffect(() => {
    fetchData();
  }, []);

  //redirects them from the dashboard
  const redirect = () => {
    window.location.href = "../Customer/Dashboard";
  };

  //checks if the date is valid
  var date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

  //a variable for the type of work
  const [multiplier, setMultiplier] = React.useState(0);

  //variables for the request
  const [WorkType, setWorkType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [membershipType, setMembershipType] = React.useState("");

  //variable for the date error message
  const [mainAlertOpen, setMainAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  //variables for the start date
  const [startDate, setStartDate] = React.useState(
    new Date().toLocaleDateString("en-GB")
  );

  //variables for the end date
  const [endDate, setEndDate] = React.useState(
    new Date().toLocaleDateString("en-GB")
  );

  /*  Start block of code for handling date picker */
  // function formats return date of dayjs object into string
  const formatDate = (date) => {
    var day = date.$D;
    var month = date.$M + 1;
    var year = date.$y;

    var newDate;

    // if else adds leading 0 if <10
    if (day < 10) newDate = "0" + day + "/";
    else newDate = day + "/";

    if (month < 10) newDate += "0" + month + "/";
    else newDate += month + "/";

    newDate += year;

    return newDate;
  };

  // useState variables to update date pickers value
  const [datePickerStart, setDatePickerStart] = React.useState(dayjs());
  const [datePickerEnd, setDatePickerEnd] = React.useState(dayjs());
  const [minDate] = React.useState(dayjs());

  // function to handle date picker change
  const settingStartDate = (date) => {
    setStartDate(formatDate(date));
    setDatePickerStart(date);
  };

  // function to handle date picker change
  const settingEndDate = (date) => {
    setEndDate(formatDate(date));
    setDatePickerEnd(date);
  };

  /*  End block of code for handling date picker */

  //code for converting the date into a format that can be submitted to the database
  var startDateParts = startDate.split("/");
  var endDateParts = endDate.split("/");

  var submitStartDateFormat =
    startDateParts[startDateParts.length - 1] +
    "-" +
    startDateParts[startDateParts.length - 2] +
    "-" +
    startDateParts[startDateParts.length - 3];

  var submitEndDateFormat =
    endDateParts[endDateParts.length - 1] +
    "-" +
    endDateParts[endDateParts.length - 2] +
    "-" +
    endDateParts[endDateParts.length - 3];

  var splitStartDate = new Date(
    startDate.split("/")[2],
    startDate.split("/")[1] - 1,
    startDate.split("/")[0]
  );

  var splitEndDate = new Date(
    endDate.split("/")[2],
    endDate.split("/")[1] - 1,
    endDate.split("/")[0]
  );

  //gets the difference between dates
  var timeDiff = Math.abs(splitEndDate.getTime() - splitStartDate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const [finalAlertDialogOpen, setFinalOpen] = React.useState(false);

  //changes the type of work requested and the multiplier associated with it
  const handleChange = (event) => {
    setWorkType(event.target.value);

    if (event.target.value == "TREE_REMOVAL") {
      setMultiplier(300);
    } else if (event.target.value == "ROOF_CLEANING") {
      setMultiplier(700);
    } else if (event.target.value == "FENCE_INSTALLATION") {
      setMultiplier(800);
    } else if (event.target.value == "OVEN_REPAIRS") {
      setMultiplier(400);
    } else if (event.target.value == "POOL_CLEANING") {
      setMultiplier(600);
    }
  };

  //fetches the data from the database
  const fetchData = async () => {
    try {
      const response = await instance.get(
        "http://localhost:8080/api/customers"
      );

      setMembershipType(response.data.membership.membershipType);
    } catch {
      handleDateAlert("An error occurred while fetching account information");
    }
  };

  //handles the closing of the final alert
  const handleClose = () => {
    setMainAlertOpen(false);
  };

  //handles the closing of the date alert
  const handleDateAlert = (message) => {
    setMainAlertOpen(true);
    setAlertMessage(message);
  };

  //function to submit the new request
  const handleSubmit = (event) => {
    event.preventDefault();

    //validation for start and end date
    if (!date_regex.test(startDate) || !date_regex.test(endDate)) {
      handleDateAlert("Invalid Date Format, please use DD/MM/YYYY");
    } else if (
      datePickerStart.isAfter(datePickerEnd) ||
      datePickerStart.isSame(datePickerEnd)
    ) {
      handleDateAlert("Start date must be before end date");
    } else {
      try {
        //makes the post request to the backend
        instance
          .post(`http://localhost:8080/api/service-requests/create`, {
            cost:
              membershipType == "CLIENT_SUBSCRIPTION"
                ? 0
                : diffDays * multiplier + 200,
            description: description,
            serviceType: WorkType.toUpperCase(),
            dateTimeRange: {
              startDate: submitStartDateFormat,
              startTime: "9:00am",
              endDate: submitEndDateFormat,
              endTime: "5:00pm",
            },
          })
          .then((res) => {
            setFinalOpen(true);
          })
          .catch((error) => {
            if (error.response.status === 403)
              handleDateAlert("Error submitting request, please try again");
          });
      } catch (error) {
        handleDateAlert("Error submitting request, please try again");
      }
    }
  };

  return (
    <React.Fragment>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 700,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            <Typography sx={{ overflow: "auto" }} variant="h4" gutterBottom>
              New Request
            </Typography>

            <Divider />
            <Typography sx={{ mt: 2 }} variant="h5" gutterBottom>
              Request Details
            </Typography>
            <FormControl sx={{ width: "40%" }}>
              <InputLabel id="demo-simple-select-label">Work Type</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={WorkType}
                label="Work Type"
                onChange={handleChange}
              >
                <MenuItem value="TREE_REMOVAL">Tree Removal</MenuItem>
                <MenuItem value="ROOF_CLEANING">Roof Cleaning</MenuItem>
                <MenuItem value="FENCE_INSTALLATION">
                  Fence Installation
                </MenuItem>
                <MenuItem value="OVEN_REPAIRS">Oven Repair</MenuItem>
                <MenuItem value="POOL_CLEANING">Pool Cleaning</MenuItem>
              </Select>
            </FormControl>
            <br />
            <Typography sx={{ mt: 2 }} variant="h6" gutterBottom>
              Work Instructions
            </Typography>
            <TextField
              fullWidth
              id="outlined-m<form onSubmit={handleSubmit}>ultiline-static"
              label="Instructions"
              required
              multiline
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              defaultValue="Insert any relevant information about the job here"
            />
            <DatePicker
              label="Start Date"
              value={datePickerStart}
              onChange={(event) => settingStartDate(event)}
              format="DD/MM/YYYY"
              sx={{ marginTop: "16px" }}
              minDate={minDate}
            />
            <br />
            <DatePicker
              label="End Date"
              value={datePickerEnd}
              onChange={(event) => settingEndDate(event)}
              format="DD/MM/YYYY"
              sx={{ marginTop: "16px" }}
              minDate={minDate}
            />
            <br />
            {membershipType == "PAY_ON_DEMAND" && (
              <Typography sx={{ mt: 2 }} variant="h6" gutterBottom>
                Total Cost: ${diffDays * multiplier + 200}
              </Typography>
            )}
            {membershipType == "CLIENT_SUBSCRIPTION" && (
              <Typography sx={{ mt: 2 }} variant="h6" gutterBottom>
                Total Cost: $0, you're a loyal subscriber!
              </Typography>
            )}
            <Button color="success" fullWidth type="submit" variant="contained">
              Submit New Work Request
            </Button>

            <br />
            <br />

            <Button
              color="primary"
              fullWidth
              onclick={redirect}
              variant="contained"
            >
              Back to Dashboard
            </Button>
          </form>
        </LocalizationProvider>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={mainAlertOpen}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Stack>
        <Dialog
          open={finalAlertDialogOpen}
          //onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            style={{
              backgroundColor: "#4caf50",
              color: "white",
            }}
            id="alert-dialog-title"
          >
            {"Success!"} <TaskAltIcon />
          </DialogTitle>
          <DialogContent
            style={{
              backgroundColor: "#4caf50",
            }}
          >
            <DialogContentText
              style={{
                backgroundColor: "#4caf50",
                color: "white",
              }}
              id="alert-dialog-description"
            >
              You have successfully created a service request! The job has been
              broadcasted to Service Providers in your area who will apply for
              the job shortly. After this you can approve a particular service
              provider and they'll get right to work! To see the progress of
              this service request, visit the Current Requests tabs on the
              siderbar or view them from the dashboard menu.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              backgroundColor: "#4caf50",
            }}
          >
            <Link href="./" passHref legacyBehavior color="inherit">
              <Button
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                }}
                autoFocus
              >
                Back to Dashboard
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </Paper>
    </React.Fragment>
  );
}

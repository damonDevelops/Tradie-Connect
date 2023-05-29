import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

import { useRouter } from "next/router";

import { Divider, Grid, TextField } from "@mui/material";
import Link from "next/link";

import Box from "@mui/material/Box";

import useFetchData from "../hooks/fetchData";
import axios from "axios";

import Rating from "@mui/material/Rating";
import { styled } from "@mui/system";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const theme = createTheme();

const instance = axios.create({
  withCredentials: true,
});

export default function ViewRequest() {
  // router used to determine where the user came from
  const router = useRouter();
  const requestId = router.query.id;
  const fromRequests = router.query.fromRequests;

  // useEffect to redirect customer that tries to access page from anywhere
  // but the requests page
  useEffect(() => {
    if (!fromRequests) {
      router.back();
    }
  }, [fromRequests, router]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Typography variant="h4" gutterBottom>
        Service Request Details
      </Typography>

      {/* checks the customer type through the router and shows the correct view*/}
      {router.query.customer ? <CustomerView /> : null}
      {router.query.serviceProvider ? <ServiceProviderView /> : null}
    </ThemeProvider>
  );
}

// CustomerView returns the customer view of service order based on user type = customer
function CustomerView() {
  // router used for re-directing
  const router = useRouter();
  // fetch url for customer service orders
  const fetchURL =
    "http://localhost:8080/api/service-requests/" + router.query.id;

  // gets data using fetchData function
  const { data: responseData } = useFetchData(fetchURL);

  return (
    <>
      <Paper sx={{ p: 2 }}>
        {responseData ? (
          <>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Request ID:"
                  value={responseData.id}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Status:"
                  value={
                    responseData.status
                      ? capitaliseWords(responseData.status)
                      : responseData.status
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Type:"
                  value={
                    responseData.serviceType
                      ? capitaliseWords(responseData.serviceType)
                      : responseData.serviceType
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date Submitted:"
                  value={
                    responseData.requestedDate
                      ? formatDate(responseData.requestedDate)
                      : responseData.requestedDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Scheduled Date:"
                  value={
                    responseData.scheduledStartDate
                      ? formatDate(responseData.scheduledStartDate)
                      : responseData.scheduledStartDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Scheduled Finish:"
                  value={
                    responseData.scheduledEndDate
                      ? formatDate(responseData.scheduledEndDate)
                      : responseData.scheduledEndDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {responseData.status == "COMPLETED" && (
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Actual Finish Date:"
                    value={
                      responseData.completedOn
                        ? formatDate(responseData.completedOn)
                        : responseData.completedOn
                    }
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Cost:"
                  value={"$" + responseData.cost}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Instructions:"
                  value={responseData.description}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  multiline={true}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                {responseData.status == "PENDING" ? (
                  <TradieTable data={responseData} />
                ) : null}
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="h6">Loading...</Typography>
        )}
      </Paper>
      {/* following lines check the status of service order and shows the correct information based on the status */}
      {(responseData.status == "COMPLETED" ||
        responseData.status == "ACCEPTED") && (
        <ServiceProviderInfo serviceProvider={responseData.serviceProvider} />
      )}
      {responseData.status == "COMPLETED" && (
        <ReviewComponent dataObject={responseData} userType="customer" />
      )}
    </>
  );
}

// function to show the service provider information
function ServiceProviderInfo({ serviceProvider }) {
  return (
    <>
      <Typography variant="h6">Service Provider Information:</Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Company Name:"
              value={serviceProvider.companyName}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Contact No."
              value={serviceProvider.phoneNumber}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="ABN:"
              value={serviceProvider.abn}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Business Address:"
              value={serviceProvider.streetAddress}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Suburb"
              value={serviceProvider.suburb.name}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Postcode:"
              value={serviceProvider.postCode}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              <b>Rating:</b>
            </Typography>
            <Rating
              readOnly
              precision={0.5}
              value={
                serviceProvider.rating
                  ? serviceProvider.rating
                  : returnRandomRating()
              }
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

// review component to show the review table once request is completed
function ReviewComponent({ dataObject, userType }) {
  // state variables for the function
  const [value, setValue] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [reviewExists, setReviewExists] = React.useState(
    dataObject.review != null ? true : false
  );

  //if reviewExists, set the value and comment
  useEffect(() => {
    if (reviewExists) {
      setValue(dataObject.review.rating);
      setComment(dataObject.review.comment);
    }
  }, []);

  // function to handle the review request
  const handleReview = async () => {
    try {
      const response = instance
        .post("http://localhost:8080/api/reviews", {
          customerId: dataObject.customer.id,
          serviceProviderId: dataObject.serviceProvider.id,
          serviceRequestId: dataObject.id,
          rating: value,
          comment: comment,
        })
        .then((response) => {
          if (response.status == 200) {
            setReviewExists(true);
          }
        });
    } catch (error) {
      alert("Review Failed!");
    }
  };

  return (
    <>
      {userType == "customer" && (
        <Typography variant="h6" gutterBottom>
          Review Request
        </Typography>
      )}

      {userType == "customer" && (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "auto",
          }}
        >
          <Box
            sx={{
              "& > legend": { mt: 2 },
            }}
          >
            <Typography variant="h7" gutterBottom>
              Please leave a review about the quality of the service you
              received from {dataObject.serviceProvider.companyName}
            </Typography>
            <br />
            <br />
            <Typography variant="h6">Rating:</Typography>
            <Rating
              readOnly={reviewExists}
              precision={0.5}
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
            <br />
            <br />
            <TextField
              InputProps={{
                readOnly: reviewExists,
              }}
              sx={{ width: "100%" }}
              id="outlined-multiline-static"
              label="Additional Feedback"
              multiline
              rows={3}
              variant="outlined"
              onChange={(event) => setComment(event.target.value)}
              value={comment}
            />
            <br />
            <br />

            {!reviewExists && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleReview}
              >
                Submit Review
              </Button>
            )}
            {reviewExists && (
              <Button
                variant="contained"
                color="primary"
                disabled
                style={{ backgroundColor: "lightgreen", color: "black" }}
              >
                Review Submitted
              </Button>
            )}
          </Box>
        </Paper>
      )}
      {reviewExists && userType == "service_provider" && (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "auto",
          }}
        >
          <Box
            sx={{
              "& > legend": { mt: 2 },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Review from {dataObject.customer.firstName}{" "}
            </Typography>
            <Typography variant="h7">Rating:</Typography>
            <br />
            <Rating
              readOnly={reviewExists}
              precision={0.5}
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
            <Divider />
            <br />

            <Typography variant="h7">Additional Feedback:</Typography>
            <br />
            <Typography variant="h7" fontStyle={{ fontStyle: "italic" }}>
              "{comment}"
            </Typography>
          </Box>
        </Paper>
      )}
    </>
  );
}

// function takes service request object then maps applicants (service providers who have applied for the job)
// then displays them in a list for the customer
function TradieTable({ data }) {
  // rows variable holds list of applicants
  const rows = data.applicants.map((applicant) => applicant.serviceProvider);

  // useState for the final alert diaglog
  const [finalAlertDialogOpen, setFinalOpen] = React.useState(false);

  // style to make the rating stars smaller
  const SmallerRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-icon": {
      fontSize: theme.typography.fontSize - 2,
    },
  }));

  // for the post request
  const instance = axios.create({
    withCredentials: true,
  });

  // async function to submit post request for accepting tradie
  const handleOnAccept = async (id) => {
    try {
      const postURL =
        "http://localhost:8080/api/service-requests/" +
        data.id +
        "/accept-service-provider/" +
        id;
      const response = instance.post(postURL);
      setFinalOpen(true);
    } catch (error) {}
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

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400 }}>
      <Table stickyHeader>
        <TableRow>
          <TableCell sx={headerStyles}>Company Name</TableCell>
          <TableCell sx={headerStyles}>Rating</TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyles}>{row.companyName}</TableCell>
              <TableCell sx={cellStyles}>
                {
                  <SmallerRating
                    name="rating"
                    value={row.rating ? row.rating : returnRandomRating()}
                    precision={0.5}
                    readOnly
                  />
                }
              </TableCell>
              <TableCell sx={cellStyles}>
                <Button
                  component="a"
                  variant="outlined"
                  onClick={() => handleOnAccept(row.id)}
                >
                  ACCEPT
                </Button>
              </TableCell>
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
                    You have successfully accepted {row.companyName} for the
                    job! The Service Provider will complete the job in the set
                    timeframe. Once they have finished they will mark the job as
                    completed. To see the progress of this service request,
                    visit the Current Requests tabs on the siderbar or view them
                    from the dashboard menu.
                  </DialogContentText>
                </DialogContent>
                <DialogActions
                  style={{
                    backgroundColor: "#4caf50",
                  }}
                >
                  <Link href="../" passHref legacyBehavior color="inherit">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// function returns the serrvice provider view of the current request
function ServiceProviderView() {
  const router = useRouter();

  // for the get request
  const fetchURL =
    "http://localhost:8080/api/service-requests/" + router.query.id;
  const { data: responseData } = useFetchData(fetchURL);

  // used to set suburb/postcode
  // as trying to directly access throws error
  const [suburb, setSuburb] = useState();
  const [postCode, setPostcode] = useState();

  useEffect(() => {
    try {
      setSuburb(responseData.customer.suburb.name);
      setPostcode(responseData.customer.postCode);
    } catch (error) {}
  }, [responseData]);

  // to get user id
  const userInfo = jwtDecode(Cookies.get("JWT"));

  // to determine whether appy button should show
  const [canApply, setCanApply] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // use effect checks if it's created or pending, then checks if current user has already applied
  useEffect(() => {
    if (responseData.status == "CREATED" || responseData.status == "PENDING") {
      setCanApply(true);
    }
    try {
      const applicantIds = responseData.applicants.map(
        (applicant) => applicant.serviceProvider.id
      );
      if (applicantIds.includes(userInfo.userId)) setHasApplied(true);
      else setHasApplied(false);
    } catch (error) {
      setCanApply(false);
    }
  }, [responseData.status]);

  // function for service-provider to apply for a job
  const handleOnApply = async () => {
    try {
      const postURL =
        "http://localhost:8080/api/service-requests/" +
        responseData.id +
        "/apply";
      const response = instance.post(postURL);
      setHasApplied(true);
    } catch (error) {}
  };

  // use effect determins if job has been completed or can be marked as completed
  const [canComplete, setCanComplete] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  useEffect(() => {
    if (responseData.status == "ACCEPTED") {
      setCanComplete(true);
    }
  });

  // useState for the final alert diaglog
  const [finalAlertDialogOpen, setFinalOpen] = useState(false);

  // handles mark as completed button
  const handleOnCompleted = async () => {
    try {
      const postURL =
        "http://localhost:8080/api/service-requests/" +
        responseData.id +
        "/complete";
      const response = instance.post(postURL);
      setHasCompleted(true);
      setFinalOpen(true);
    } catch (error) {}
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>
        {responseData ? (
          <>
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Request ID:"
                  value={responseData.id}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Status:"
                  value={
                    responseData.status
                      ? capitaliseWords(responseData.status)
                      : responseData.status
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Type:"
                  value={
                    responseData.serviceType
                      ? capitaliseWords(responseData.serviceType)
                      : responseData.serviceType
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Date Submitted:"
                  value={
                    responseData.requestedDate
                      ? formatDate(responseData.requestedDate)
                      : responseData.requestedDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Scheduled Date:"
                  value={
                    responseData.scheduledStartDate
                      ? formatDate(responseData.scheduledStartDate)
                      : responseData.scheduledStartDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Scheduled Finish:"
                  value={
                    responseData.scheduledEndDate
                      ? formatDate(responseData.scheduledEndDate)
                      : responseData.scheduledEndDate
                  }
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {responseData.status == "COMPLETED" && (
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Actual Finish Date:"
                    value={
                      responseData.completedOn
                        ? formatDate(responseData.completedOn)
                        : responseData.completedOn
                    }
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
              {(responseData.status == "ACCEPTED" ||
                responseData.status == "COMPLETED") && (
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Street Address:"
                    value={responseData.customer.streetAddress}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Suburb:"
                  value={suburb}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Postcode:"
                  value={postCode}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Pays:"
                  value={"$" + responseData.cost}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Instructions:"
                  value={responseData.description}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  multiline={true}
                  fullWidth
                />
              </Grid>

              {canApply && !hasApplied && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOnApply}
                  >
                    Apply
                  </Button>
                </Grid>
              )}
              {canApply && hasApplied && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    style={{ backgroundColor: "lightgreen", color: "black" }}
                  >
                    Applied
                  </Button>
                </Grid>
              )}
              {canComplete && !hasCompleted && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOnCompleted}
                  >
                    Mark job as completed
                  </Button>
                </Grid>
              )}
              {canComplete && hasCompleted && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "lightgreen", color: "black" }}
                    onClick={handleOnCompleted}
                    disabled
                  >
                    Completed
                  </Button>
                </Grid>
              )}
              <Dialog
                open={finalAlertDialogOpen}
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
                    You have successfully completed the job! The customers
                    payment will be paid into your account shortly. To see the
                    history of your completed jobs, check out the Finished
                    Requests page.
                  </DialogContentText>
                </DialogContent>
                <DialogActions
                  style={{
                    backgroundColor: "#4caf50",
                  }}
                >
                  <Link
                    href="../Current-Requests"
                    passHref
                    legacyBehavior
                    color="inherit"
                  >
                    <Button
                      style={{
                        backgroundColor: "#4caf50",
                        color: "white",
                      }}
                      autoFocus
                    >
                      Back to Current Requests
                    </Button>
                  </Link>
                </DialogActions>
              </Dialog>
            </Grid>
          </>
        ) : (
          <Typography variant="h6">Loading...</Typography>
        )}
      </Paper>
      {/* following lines check the status of service order and shows the correct information based on the status */}
      {(responseData.status == "COMPLETED" ||
        responseData.status == "ACCEPTED") && (
        <CustomerInfo customer={responseData.customer} />
      )}
      {responseData.status == "COMPLETED" && (
        <ReviewComponent
          dataObject={responseData}
          userType="service_provider"
        />
      )}
    </>
  );
}

// function returns box of customer information for service provider to view
function CustomerInfo({ customer }) {
  return (
    <>
      <Typography variant="h6">Customer Information:</Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Customer Name:"
              value={customer.firstName + " " + customer.lastName}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Contact No."
              value={customer.phoneNumber}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Contact Email:"
              value={customer.email}
              disabled
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

// takes a string and capitalises the first letter of each word. Makes every other letter lower case.
function capitaliseWords(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// formats date specific to how it is held in the date array
// date[0] = year, date[1] = month, date[2] = day
function formatDate(date) {
  return date[2] + "/" + date[1] + "/" + date[0];
}

// used if no rating available to show functionality
function returnRandomRating() {
  const max = 5.0;
  const min = 2.5;
  return Math.random() * (max - min) + min;
}

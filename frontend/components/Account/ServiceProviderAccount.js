// Page allows service provide to update their account details
import * as React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import postCodeToState from "../functional_components/postcodeToState";
import {Grid} from "@mui/material";

export default function Account() {
  //state variables for account details
  const [companyName, setCompanyName] = useState("");
  const [abn, setABN] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");

  //state variables for confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  //open variables for alerts
  const [mainAlertOpen, setMainAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //regex for postcode
  const postcodeRegex = new RegExp("^(0[289][0-9]{2})|([1-9][0-9]{3})");
  const postcodeLimitChar = 4;

  //function to handle postcode change
  const handlePostcodeChange = (event) => {
    if (event.target.value.toString().length <= postcodeLimitChar) {
      setPostcode(event.target.value);
      setState(postCodeToState(event.target.value));
    }
  };

  //function to handle alerts
  const handleAlert = (message) => {
    setMainAlertOpen(true);
    setAlertMessage(message);
  };

  //function to handle closing alerts
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMainAlertOpen(false);
    setConfirmationOpen(false);
  };

  //function to fetch the Service Provider data to display
  useEffect(() => {
    fetchData();
  }, []);

  const instance = axios.create({
    withCredentials: true,
  });

  //function to fetch data from backend to autofill
  const fetchData = async () => {
      instance
        .get("http://localhost:8080/api/service-providers")
        .then((response) => {
          setCompanyName(response.data.companyName);
          setABN(response.data.abn);
          setPhone(response.data.phoneNumber);
          setAddress(response.data.streetAddress);
          setCity(response.data.suburb.name);
          setPostcode(response.data.postCode);
          setState(response.data.suburb.state);
        })
        .catch((error) => {
          handleAlert("An error occured: " + error);
          console.error(error);
        });
      
    };

    //function to handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmationOpen(true);
  };
  

  //function to handle submit
  //updates Service Provider details after confirmation, then refreshes page
  const putData = (event) => {
    event.preventDefault();
  
    if (!postcodeRegex.test(postcode)) {
      handleAlert("Invalid Postcode");
    } else {
      instance
        .put(`http://localhost:8080/api/service-providers`, {
          companyName: companyName,
          abn: abn,
          phoneNumber: phone,
          streetAddress: address,
          suburb: {
            name: city,
            state: state,
          },
          postCode: postcode,
        })
        .then((res) => {
          window.location.reload(true);
        })
        .catch((error) => {
          handleAlert("An Error Occurred: " + error)
        });
    }
  };

  return (
    <React.Fragment>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 750,
        }}
      >
        <Typography sx={{ overflow: "auto" }} variant="h4" gutterBottom>
          Update Account Information
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="companyName"
                onChange={(event) => setCompanyName(event.target.value)}
                value={companyName}
                required
                fullWidth
                id="companyName"
                label="Company Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="abn"
                onChange={(event) => setABN(event.target.value)}
                value={abn}
                required
                fullWidth
                id="abn"
                label="ABN"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="phone"
                name="phone"
                onChange={(event) => setPhone(event.target.value)}
                value={phone}
                required
                fullWidth
                id="phone"
                label="Phone"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="address"
                name="address"
                onChange={(event) => setAddress(event.target.value)}
                value={address}
                required
                fullWidth
                id="address"
                label="Address"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="city"
                name="city"
                onChange={(event) => setCity(event.target.value)}
                value={city}
                required
                fullWidth
                id="city"
                label="City"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="postcode"
                name="postcode"
                onChange={(event) => handlePostcodeChange(event)}
                value={postcode}
                required
                fullWidth
                id="postcode"
                label="Postcode"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="state"
                name="state"
                onChange={(event) => setState(event.target.value)}
                value={state || ""}
                required
                fullWidth
                id="state"
                label="State"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="warning"
              >
                Update Account Details
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                href="/Service-Provider"
                variant="contained"
              >
                Back to Dashboard
              </Button>
            </Grid>
          </Grid>
        </form>
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
          open={confirmationOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmation of New Account Details"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check that the following details are correct:
            </DialogContentText>
            <br />
            <DialogContentText id="alert-dialog-description">
              Updated First Name: {companyName}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated Last Name: {abn}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated Phone Number: {phone}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated Address: {address}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated City: {city}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated Postcode: {postcode}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Updated State: {state}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Edit Details</Button>
            <Button onClick={putData} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </React.Fragment>
  );
}

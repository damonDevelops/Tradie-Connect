// Customer sign up page is for customers to sign up to the website.
// it contains a form for the customer to fill out their details and sign up to the website.


import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Autocomplete } from "@mui/material";
import validator from "validator";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import postCodeToState from "../functional_components/postcodeToState";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

//Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//default function for the customer sign up page
export default function CustomerSignUp() {
  //state variables for the alerts
  const [mainAlert, setMainAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const [failedSignUpOpen, setFailedSignUp] = React.useState(false);
  const [finalAlertDialogOpen, setFinalOpen] = React.useState(false);

  const timer = React.useRef();
  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const [paymentDialogOpen, setPaymentOpen] = React.useState(false);

  //Card Information
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");

  const [expiryDate, setExpiryDate] = React.useState("");
  //const [expiryDate, setExpiryDate] = React.useState(dayjs());
  const [cvv, setCVV] = React.useState("");
  const [flag, setFlag] = React.useState(true);
  const [hasCustomerPaid, setHasCustomerPaid] = React.useState(false);
  const [minDate] = React.useState(dayjs());

  //function to close the add payment method dialog
  const closeCard = () => {
    //check if all the fields are filled
    if (cardName && cardNumber && expiryDate && cvv) {
      setPaymentOpen(false);
      setFlag(!flag);
      setHasCustomerPaid(true);
    }
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  //function to handle alerts for invalid input
  const handleAllAlerts = (message) => {
    setMainAlert(true);
    setAlertMessage(message);
  };

  //const to open the payment dialog
  const handlePaymentOpen = () => {
    setPaymentOpen(true);
  };

  //function to handle the sign up
  const redirect = () => {
    window.location.href = "../SignIn";
  };

  //function to close the alerts
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFailedSignUp(false);
    setMainAlert(false)
  };

  //function to handle the payment dialog
  const handlePaymentClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setPaymentOpen(false);
  };

  //function to check if the card information is valid
  const validateCardInfo = () => {
    if (cardName && cardNumber && expiryDate && cvv) {
      return true;
    }
  };

  //function to check if the customer has paid
  const paymentPending = () => {
    if (hasCustomerPaid) {
      return true;
    }
  };

  //state variables for the form
  const [returnMemberType, setMembershipType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [returnState, setState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //regex for the postcode validation
  const postcodeRegex = new RegExp("^(0[289][0-9]{2})|([1-9][0-9]{3})");

  //limit the number of characters in the postcode field
  const postcodeLimitChar = 4;
  const cardNumberLimit = 16;
  const cvvLimit = 3;

  //function to handle the postcode change
  const handlePostcodeChange = (event) => {
    if (event.target.value.toString().length <= postcodeLimitChar) {
      setPostcode(event.target.value);
      setState(postCodeToState(event.target.value));
    }
  };

  //function to handle the card number change to make sure it's less than 16 characters
  const handleCardNumberChange = (event) => {
    if (event.target.value.toString().length <= cardNumberLimit) {
      setCardNumber(event.target.value);
    }
  };

  //function to handle the cvv change to make sure it's less than 3 characters
  const handleCVVChange = (event) => {
    if (event.target.value.toString().length <= cvvLimit) {
      setCVV(event.target.value);
    }
  };

  //const to hold the trade options
  const membershipOptions = [
    { value: "Subscription", label: "Subscription" },
    { value: "Pay on Demand", label: "Pay on Demand" },
  ];

  //handle submit function for the form
  //checks for invalid input and alerts the user otherwise makes a post request to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validator.isEmail(email) == false) {
      handleAllAlerts("Please enter a valid email address");
    } else if (!postcodeRegex.test(postcode)) {
      handleAllAlerts("Please enter a valid postcode");
    } else if (password != confirmPassword) {
      handleAllAlerts("Passwords do not match");
    } else {
      e.preventDefault();

      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/SignUp",
          {
            email: email,
            password: password,
            role: "ROLE_CUSTOMER",
            firstName: firstName,
            lastName: lastName,
            phoneNumber: newPhoneNumber,
            streetAddress: address,
            suburb: {
              name: city,
              state: returnState,
            },
            paymentInformation: {
              cardName: cardName.toString(),
              cardNumber: cardNumber.toString(),
              cardExpiry: expiryDate.toString(),
              cardCVV: cvv.toString(),
            },
            postCode: postcode,
            membership: {
              membershipType: returnMemberType,
              price: 49.99,
              description: "Yearly customer membership",
            },
          }
        );
        
        setBackdropOpen(true);
        timer.current = window.setTimeout(() => {
          setBackdropOpen(false);
          setFinalOpen(true);
        }, 3000);
      } catch (error) {
        setFailedSignUp(true);
      }
    }
  };

  //not going to leave any comments on the implementation of components, you can google
  //material ui components to see how they work or go to the documentation
  //main premise is a grid with form items, a snackbar full of different alert types
  //and a backdrop for the loading symbol
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            onInputChange={(event, newInputValue) => {
              if (newInputValue == "Subscription") {
                setMembershipType("CLIENT_SUBSCRIPTION");
              } else if (newInputValue == "Pay on Demand") {
                setMembershipType("PAY_ON_DEMAND");
              } else {
                setMembershipType("ACC_CREATED");
              }
            }}
            disablePortal
            id="combo-box-demo"
            options={membershipOptions}
            renderInput={(params) => (
              <TextField required {...params} label="Membership Type" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            onChange={(event) => setFirstName(event.target.value)}
            value={firstName}
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={(event) => setLastName(event.target.value)}
            value={lastName}
            autoComplete="family-name"
          />
        </Grid>
        <Grid item sm={7}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phone"
            onChange={(event) => setNewPhoneNumber(event.target.value)}
            value={newPhoneNumber}
            autoComplete="phone"
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <TextField
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            onChange={(event) => setAddress(event.target.value)}
            value={address}
            autoComplete="address"
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            required
            fullWidth
            id="city"
            label="City"
            name="address-level2"
            onChange={(event) => setCity(event.target.value)}
            value={city}
            autoComplete="address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            type={"number"}
            inputProps={{ maxLength: 4 }}
            fullWidth
            id="postcode"
            label="Postcode"
            name="postal-code"
            onChange={(event) => handlePostcodeChange(event)}
            value={postcode}
            autoComplete="postal-code"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="state"
            label="State"
            name="state"
            onChange={(event) => setState(event.target.value)}
            value={returnState}
            autoComplete="address-level1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            value={confirmPassword}
            label="Re-enter your password"
            type="password"
            id="confirmPassword"
            autoComplete="confirmPassword"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handlePaymentOpen}
            disabled={!flag}
            fullWidth
            variant="contained"
            color={flag ? "primary" : "success"}
            sx={{
              "&.Mui-disabled": {
                background: "#CEEAD0",
                color: "white",
              },
            }}
          >
            {flag ? "Add Payment Method" : "Payment Method Added"}
          </Button>
        </Grid>
        <Dialog open={paymentDialogOpen} onClose={handlePaymentClose}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DialogTitle>Payment Method</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    fullWidth
                    id="cardName"
                    label="Name on Card"
                    sx={{marginTop: 1}}
                    onChange={(event) => setCardName(event.target.value)}
                    value={cardName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    type="number"
                    fullWidth
                    id="cardNumber"
                    label="Card Number"
                    value={cardNumber}
                    onChange={(event) => handleCardNumberChange(event)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker 
                  label={"MM / YY"} 
                  views={['month', 'year']} 
                  format="MM/YY"
                  //change the width to match the other fields
                  slotProps={{ textField: { fullWidth: true } }}
                  onChange={(event) => setExpiryDate(event.format("MM/YY"))}
                  minDate={minDate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    type="number"
                    fullWidth
                    id="cvv"
                    label="CVV"
                    value={cvv}
                    onChange={(event) => handleCVVChange(event)}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCard} disabled={!validateCardInfo()}>
                Add Payment Method
              </Button>
            </DialogActions>
          </LocalizationProvider>
        </Dialog>
        <Grid item xs={6}>
          <Button
            type="submit"
            variant="contained"
            disabled={!paymentPending()}
          >
            Sign Up
          </Button>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdropOpen}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={mainAlert}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Stack>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/SignIn" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>

        <Dialog
          open={finalAlertDialogOpen}
          onClose={handleClose}
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
            {" Success!"} <TaskAltIcon />
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
              Your account was successfully created, you will be redirected to
              the sign in page now where you can enter your details to log in.
              Thanks for joining us {firstName}!
            </DialogContentText>
          </DialogContent>
          <DialogActions
            style={{
              backgroundColor: "#4caf50",
            }}
          >
            <Button
              style={{
                backgroundColor: "#4caf50",
                color: "white",
              }}
              onClick={redirect}
              autoFocus
            >
              Sign In
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
        open={failedSignUpOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle

          id="alert-dialog-title"
        >
          {" Sign Up Failed!"} <ErrorOutlineIcon />
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
          >
            Unfortunately, sign up failed. Please ensure the email address you
            entered is not already in use. If it is not in use, please try again later. 
          </DialogContentText>
        </DialogContent>
        <DialogActions
        >
          <Button
            onClick={handleClose}
            autoFocus
          >
            Go Back
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
    </form>
  );
}

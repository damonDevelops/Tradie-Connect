import * as React from "react";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function ReviewComponent() {
  const [value, setValue] = React.useState(0);
  const [disableFields, setDisabledFields] = React.useState(false);

  const serviceProviderName = "Insert Service Provider Here";

  function handleReview() {
    setDisabledFields(true);
  }

  return (
    <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Review Request
        </Typography>
        <Box
          sx={{
            "& > legend": { mt: 2 },
          }}
        >
          <Typography variant="h7" gutterBottom>
            Please leave a review about the quality of the service you received
            from {serviceProviderName}
          </Typography>
          <Typography component="legend">
            How would you rate your service overall
          </Typography>
          <Rating
            readOnly={disableFields}
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
              readOnly: disableFields,
            }}
            sx={{ width: "100%" }}
            id="outlined-multiline-static"
            label="Additional Feedback"
            multiline
            rows={3}
            defaultValue="Optional: leave a comment about the quality of your service"
          />
          <br />
          <br />

          {
            !disableFields &&(
              <Button
                variant="contained"
                color="primary"
                onClick={handleReview}
              >
                Submit Review
              </Button>
            )
          }
          {
            disableFields &&(
                <Button
                variant="contained"
                color="primary"
                disabled
                style={{ backgroundColor: "lightgreen", color: "black" }}
              >
                Review Submitted
              </Button>
            )
          }
        </Box>
    </React.Fragment>
  );
}

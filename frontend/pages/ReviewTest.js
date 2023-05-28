// import statements
import * as React from "react";
import CustomerDash from "../components/Dashboard/CustomerDashboard";
import ReviewComponent from "../components/Review/ReviewComponent";
export default function NewRequestScreen() {
  return (
    <CustomerDash>
      <ReviewComponent />
    </CustomerDash>
  );
}

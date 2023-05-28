// import statements
import * as React from "react";
import PastRequests from "../../../components/Requests/PastRequests";
import CustomerDash from "../../../components/Dashboard/CustomerDashboard";

export default function PastRequestScreen() {
  return (
    <CustomerDash>
      <PastRequests />
    </CustomerDash>
  );
}

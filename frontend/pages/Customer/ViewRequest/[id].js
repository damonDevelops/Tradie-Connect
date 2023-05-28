// import statements
import * as React from "react";
import ViewRequest from "../../../components/Requests/ViewCurrentRequest";
import CustomerDash from "../../../components/Dashboard/CustomerDashboard";

export default function ViewRequestScreen() {
  return (
    <CustomerDash>
      <ViewRequest />
    </CustomerDash>
  );
}

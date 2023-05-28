// import statements
import * as React from "react";
import ViewRequest from "../../../components/Requests/ViewCurrentRequest";
import ServiceDash from "../../../components/Dashboard/ServiceProviderDashboard";

export default function ViewRequestScreen() {
  return (
    <ServiceDash>
      <ViewRequest />
    </ServiceDash>
  );
}

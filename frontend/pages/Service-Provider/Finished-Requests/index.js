// import statements
import * as React from "react";
import ServiceDash from "../../../components/Dashboard/ServiceProviderDashboard";
import FinishedRequests from "../../../components/Requests/FinishedRequests";

export default function ServiceProviderDashHome() {
  return (
    <ServiceDash>
      <FinishedRequests />
    </ServiceDash>
  );
}

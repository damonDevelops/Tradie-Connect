// import statements
import * as React from "react";
import ServiceDash from "../../../components/Dashboard/ServiceProviderDashboard";
import CurrentRequest from "../../../components/Requests/ServiceProviderCurrentRequest";

export default function ServiceProviderDashHome() {
  return (
    <ServiceDash>
      <CurrentRequest />
    </ServiceDash>
  );
}

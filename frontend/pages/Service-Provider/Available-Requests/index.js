// import statements
import * as React from "react";
import ServiceDash from "../../../components/Dashboard/ServiceProviderDashboard";
import AvailableRequest from "../../../components/Requests/AvailableRequests";

export default function ServiceProviderDashHome() {
  return (
    <ServiceDash>
      <AvailableRequest />
    </ServiceDash>
  );
}

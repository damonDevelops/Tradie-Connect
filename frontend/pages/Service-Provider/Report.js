// import statements
import * as React from "react";
import ServiceProviderReport from "../../components/Report/ServiceProviderReport";
import ServiceDashboard from "../../components/Dashboard/ServiceProviderDashboard";

export default function AccountScreen() {
  return (
    <ServiceDashboard>
      <ServiceProviderReport />
    </ServiceDashboard>
  );
}

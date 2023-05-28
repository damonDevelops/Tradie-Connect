// import statements
import * as React from "react";
import ServiceAccount from "../../components/Account/ServiceProviderAccount";
import ServiceDashboard from "../../components/Dashboard/ServiceProviderDashboard";

export default function AccountScreen() {
  return (
    <ServiceDashboard>
      <ServiceAccount />
    </ServiceDashboard>
  );
}

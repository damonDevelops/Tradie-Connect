// import statements
import * as React from "react";
import Report from "../../components/Report/Report";
import CustomerDash from "../../components/Dashboard/CustomerDashboard";

export default function AccountScreen() {
  return (
    <CustomerDash>
      <Report />
    </CustomerDash>
  );
}

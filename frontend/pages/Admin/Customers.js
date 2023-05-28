// import statements
import * as React from "react";
import AdminDash from "../../components/Dashboard/AdminDashboard";
import Customers from "../../components/Admin/Customers";

export default function CustomerPage() {
  return (
    <AdminDash>
      <Customers />
    </AdminDash>
  );
}

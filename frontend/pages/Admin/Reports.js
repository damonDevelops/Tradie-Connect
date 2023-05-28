// import statements
import * as React from "react";
import AdminDash from "../../components/Dashboard/AdminDashboard";
import AdminReport from "../../components/Report/AdminReport";

export default function RequestsPage() {
  return (
    <AdminDash>
      <AdminReport />
    </AdminDash>
  );
}

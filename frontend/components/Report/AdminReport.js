//Page for generating a report for the admin
//uses package jspdf to generate a pdf from the data fetched from the database

//import statements
import * as React from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import useFetchData from "../hooks/fetchData";
import { Divider } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Report() {
  //loading state for if the data is still being fetched
  const [loading, setLoading] = useState(true);

  //gets the date for the file name
  const today = new Date();
  const fileName = "Tradie_Connect_Report_" + today.toLocaleDateString("en-AU");

  //URLs for fetching data
  const customerURL = "http://localhost:8080/api/customers/all";
  const serviceProviderURL = "http://localhost:8080/api/service-providers/all";
  const requestURL = "http://localhost:8080/api/service-requests";

  const [formattedMembership, setFormattedMembership] = useState("");
  const [buttonText, setButtonText] = React.useState("Download PDF");

  const { data: customerData } = useFetchData(customerURL);
  const { data: serviceProviderData } = useFetchData(serviceProviderURL);
  const { data: requestData } = useFetchData(requestURL);

  const instance = axios.create({
    withCredentials: true,
  });

  //a serviceRequest array for transforming data from backend to frontend
  const [serviceRequestsArray, setServiceRequestsArray] = useState([]);

  const serviceRequestArray = useMemo(() => {
    const array = customerData.map((customer) => customer.serviceRequests);
    return array.flat();
  }, [customerData]);

  //useEffect to fetch service requests
  if (typeof customerData != "undefined") {
    useEffect(() => {
      const fetchData = async () => {
        if (serviceRequestArray) {
          const promises = serviceRequestArray.map((id) =>
            instance.get("http://localhost:8080/api/service-requests/" + id)
          );
          const requests = await Promise.all(promises);
          setServiceRequestsArray(requests.map((response) => response.data));
        }
      };
      fetchData().then(() => setLoading(false));
    }, [serviceRequestArray]);
  }

  //for each request in requestData, store the total cost in a variable called totalCost
  const totalCost = requestData.reduce((total, request) => {
    return total + request.cost;
  }, 0);

  //calculate the average cost
  const averageCost =
    requestData.length > 0 ? totalCost / requestData.length : 0;

  //function to create the pdf
  const createPDF = () => {
    const doc = new jsPDF({ orientation: "p" });
    doc.setFontSize(30);
    doc.text("TradieConnect Admin Report!", 10, 15);
    doc.setFontSize(20);
    doc.text("Statistics", 10, 30);
    doc.setFontSize(12);
    doc.text("Total Requests: " + requestData.length, 10, 40);
    doc.text("Total Customers: " + customerData.length, 10, 50);
    doc.text("Total Service Providers: " + serviceProviderData.length, 10, 60);
    doc.text(
      "Total Revenue: $" +
        totalCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),
      10,
      70
    );
    doc.text(
      "Average Cost: $" +
        averageCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,"),
      10,
      80
    );
    doc.setFontSize(18);
    doc.text("Customers by membership type: ", 10, 100);
    doc.setFontSize(12);
    doc.text(
      "Total number of subscriber based customers: " +
        customerData.filter(
          (customer) =>
            customer.membership.membershipType === "CLIENT_SUBSCRIPTION"
        ).length,
      10,
      110
    );
    doc.text(
      "Total number of pay per request customers: " +
        customerData.filter(
          (customer) => customer.membership.membershipType === "PAY_ON_DEMAND"
        ).length,
      10,
      120
    );
    doc.setFontSize(18);
    doc.text("Service Providers by category: ", 10, 140);
    doc.setFontSize(12);
    doc.text(
      "Total number of Roof Cleaners: " +
        serviceProviderData.filter((serviceProvider) =>
          serviceProvider.skills.includes("ROOF_CLEANING")
        ).length,
      10,
      150
    );
    doc.text(
      "Total number of Oven Repairers: " +
        serviceProviderData.filter((serviceProvider) =>
          serviceProvider.skills.includes("OVEN_REPAIRS")
        ).length,
      10,
      160
    );
    doc.text(
      "Total number of Fence Installers: " +
        serviceProviderData.filter((serviceProvider) =>
          serviceProvider.skills.includes("FENCE_INSTALLATION")
        ).length,
      10,
      170
    );
    doc.text(
      "Total number of Pool Cleaners: " +
        serviceProviderData.filter((serviceProvider) =>
          serviceProvider.skills.includes("POOL_CLEANING")
        ).length,
      10,
      180
    );
    doc.text(
      "Total number of Tree Removers: " +
        serviceProviderData.filter((serviceProvider) =>
          serviceProvider.skills.includes("TREE_REMOVAL")
        ).length,
      10,
      190
    );

    //check which suburbs each customer are from and return the top three suburbs

    const topThreeSuburbs = customerData
      .map((customer) => customer.suburb.name)
      .reduce((acc, suburb) => {
        if (acc[suburb]) {
          acc[suburb] += 1;
        } else {
          acc[suburb] = 1;
        }
        return acc;
      }, {});
    const topThreeSuburbsArray = Object.entries(topThreeSuburbs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    doc.setFontSize(18);
    doc.text("Top 3 Suburbs: ", 10, 210);
    doc.setFontSize(12);
    if (topThreeSuburbsArray.length > 0) {
      doc.text(
        "1. " +
          topThreeSuburbsArray[0][0] +
          " - " +
          topThreeSuburbsArray[0][1] +
          " customers",
        10,
        220
      );
    }
    if (topThreeSuburbsArray.length > 1) {
      doc.text(
        "2. " +
          topThreeSuburbsArray[1][0] +
          " - " +
          topThreeSuburbsArray[1][1] +
          " customers",
        10,
        230
      );
    }
    if (topThreeSuburbsArray.length > 2) {
      doc.text(
        "3. " +
          topThreeSuburbsArray[2][0] +
          " - " +
          topThreeSuburbsArray[2][1] +
          " customers",
        10,
        240
      );
    }

    if (customerData.length > 0) {
      doc.addPage(null, "l");
      doc.setFontSize(20);
      doc.text("Customers", 10, 15);
      autoTable(doc, {
        margin: { top: 20 },
        styles: { halign: "center", fontSize: 14 },
        head: [
          [
            "Customer ID",
            "Email",
            "First Name",
            "Last Name",
            "Membership Type",
            "Suburb",
            "Number of Requests",
          ],
        ],
        body: customerData.map((customer) => {
          return [
            customer.id,
            customer.email,
            customer.firstName,
            customer.lastName,
            capitaliseWords(customer.membership.membershipType),
            customer.suburb.name,
            customer.serviceRequests.length,
          ];
        }),
      });
    } else {
      doc.setFontSize(12);
      doc.text("No Customers", 10, 280);
    }

    if (serviceProviderData.length > 0) {
      doc.addPage(null, "l");
      doc.setFontSize(20);
      doc.text("Service Providers", 10, 15);
      autoTable(doc, {
        margin: { top: 20 },
        styles: { halign: "center", fontSize: 11 },
        head: [
          [
            "ID",
            "Email",
            "Company Name",
            "ABN",
            "Suburb",
            "Skills",
            "# Requests",
            "Rating",
          ],
        ],
        body: serviceProviderData.map((serviceProvider) => {
          return [
            serviceProvider.id,
            serviceProvider.email,
            serviceProvider.companyName,
            serviceProvider.abn,
            serviceProvider.suburb.name,
            capitaliseWords(
              serviceProvider.skills[
                Math.floor(Math.random() * serviceProvider.skills.length)
              ]
            ),
            serviceProvider.serviceRequests.length,
            Math.round(serviceProvider.rating),
          ];
        }),
      });
    } else {
      doc.setFontSize(12);
      doc.text("No Service Providers", 10, 280);
    }

    if (requestData.length > 0) {
      doc.addPage(null, "l");
      doc.text("Requests", 10, 15);

      autoTable(doc, {
        styles: { halign: "center", fontSize: 11 },
        margin: { top: 20 },
        head: [
          [
            "Request ID",
            "Customer Name",
            "Service Provider Name",
            "Service Type",
            "Scheduled Start Date",
            "Scheduled End Date",
            "Status",
            "Cost",
          ],
        ],
        body:
          //for each element in serviceRequestArray, return an array of the values of the keys in the head array
          serviceRequestsArray.map((serviceRequest) => {
            return [
              serviceRequest.id,
              serviceRequest.customer.firstName,
              (serviceRequest.serviceProvider &&
                serviceRequest.serviceProvider.companyName) ||
                "N/A", // Add an additional conditional check
              capitaliseWords(serviceRequest.serviceType),
              formatDate(serviceRequest.scheduledStartDate),
              formatDate(serviceRequest.scheduledEndDate),
              capitaliseWords(serviceRequest.status),
              "$" +
                serviceRequest.cost
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, "$&,"),
            ];
          }),
      });
    } else {
      doc.setFontSize(12);
      doc.text("No Requests", 10, 270);
    }

    doc.save(fileName + ".pdf");
  };

  return (
    <React.Fragment>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Divider />
        <br />
        <Typography variant="h6" gutterBottom>
          To generate a PDF file of your requests, payment information and more,
          click the button below.
        </Typography>
        <br />
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={!customerData || customerData.length === 0}
          onClick={createPDF}
        >
          {customerData === undefined
            ? "Could not connect to server, can't generate report"
            : customerData && customerData.length === 0
            ? "No data to generate PDF"
            : "Download PDF"}
        </LoadingButton>
      </Paper>
    </React.Fragment>
  );
}

//function to format the capital words
function capitaliseWords(str) {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

//function to format the date
function formatDate(date) {
  return date[2] + "/" + date[1] + "/" + date[0];
}

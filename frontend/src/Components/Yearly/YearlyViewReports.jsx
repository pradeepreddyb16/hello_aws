import React, { useState, useEffect } from "react";
import { Typography, Grid, Box, Button, Stack } from "@mui/material";
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
const axios = require("axios");

export function YearlyViewReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    await axios.get("/api/yearly_view").then((res) => {
      if (res.data.status === true) {
        setData(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      }
    });
  };
  const downloadZip = async () => {
    await axios
      .get("api/download1", {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.zip"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };
  const columns = [
    // { name: "Id", selector: "id", sortable: true },
    { name: " Store No", selector: "store_no", sortable: true },
    { name: "Store Code", selector: "store_code", sortable: true },
    {
      name: "Store Name",
      selector: "store_name",
      sortable: true,
      editable: true,
    },
    { name: "Opening Date", selector: "store_opening_date", sortable: true },
    { name: "City", selector: "city", sortable: true },
    { name: "State", selector: "state", sortable: true },
    { name: "Region", selector: "region", sortable: true },
    { name: "Type", selector: "type", sortable: true },
    { name: "Status of Store", selector: "status_of_store", sortable: true },
    { name: "Footage(m2)", selector: "footage_m2", sortable: true },
    { name: "Footage(ft2)", selector: "footage_ft2", sortable: true },
    {
      name: "Elec Billing?",
      selector: "seperate_elec_billing",
      sortable: true,
    },
    { name: "DG Billing", selector: "seperate_dg_billing", sortable: true },
    {
      name: "Bill Received ",
      selector: "bill_received_by_store__sent_direct_to_ho",
      sortable: true,
    },
    {
      name: "Bill Paid Direct or Landlord",
      selector: "bill_paid_direct_or_landlord",
      sortable: true,
    },
    { name: "Service From", selector: "service_from", sortable: true },
    { name: "Service To", selector: "service_to", sortable: true },
    { name: "Elec - kWh", selector: "elec_kwh", sortable: true },
    { name: "Service From", selector: "service_from1", sortable: true },
    { name: "Service To", selector: "service_to1", sortable: true },
    { name: "DG - kWh", selector: "dg_kwh", sortable: true },
    { name: "Service From", selector: "service_from2", sortable: true },
    { name: "Service To", selector: "service_to2", sortable: true },
    { name: "HAVC-kW", selector: "hvac_kwh", sortable: true },
    { name: "R22-kg", selector: "r22_kg", sortable: true },
    { name: "R404-kg", selector: "r404_kg", sortable: true },
    { name: "R407-kg", selector: "r407_kg", sortable: true },
    { name: "Other-Kg", selector: "other__kg", sortable: true },
    {
      name: "Average",
      selector: "average_taken_as_no_update_from_store",
      sortable: true,
    },
    {
      name: "change in sq.ft",
      selector: "change_in_sq_ft_in_the_store",
      sortable: true,
    },
    { name: "Store closed", selector: "store_closed", sortable: true },
    { name: "New Store", selector: "new_store", sortable: true },
    {
      name: "Closed store due to Lock down",
      selector: "closed_store_due_to_lock_down",
      sortable: true,
    },
    { name: "Notes", selector: "notes", sortable: true },
  ];
  const tableData = {
    columns,
    data,
  };
  return (
    <Box sx={{ m: 9 }}>
      <Stack direction="row ">
        <Typography variant="h4">Year Report</Typography>&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        {/* <Button
          variant="contained"
          color="warning"
        >
          Download
        </Button> */}
      </Stack>
      <Box
        sx={{
          width: 1100,
          overflow: "hidden",
        }}
      >
        <DataTableExtensions
          print={false}
          filterPlaceholder="Search..."
          {...tableData}
        >
          <DataTable
            customStyles={{
              headCells: {
                style: {
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "bold",
                  paddingLeft: "0 8px",
                  justifyContent: "center",
                  backgroundColor: "#2f7d32",
                },
              },
            }}
            id="html-excel"
            columns={columns}
            data={data}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="600px"
            highlightOnHover
          />
        </DataTableExtensions>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        {/* <Link to="/Dashboard/yearlyreports" style={{ underline: "none" }}>
          <ArrowBackIcon fontSize="very very small" align="left" />
          back
        </Link> */}    
      <Button variant="contained" onClick={()=>navigate("/Dashboard/monthlyreports")}>Back</Button> </Grid>
    </Box>
  );
}

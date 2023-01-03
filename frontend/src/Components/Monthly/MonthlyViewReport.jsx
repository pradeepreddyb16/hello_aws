import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  Stack,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import DataTable from "react-data-table-component";
import ReactToExcel from "react-html-table-to-excel";
import { useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import DataTableExtensions from "react-data-table-component-extensions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-data-table-component-extensions/dist/index.css";
const axios = require("axios");

export function MonthlyViewReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    const month = localStorage.getItem("month");
    const formdata = new FormData();
    formdata.append("vmonth", month);
    console.log(month);
    await axios.post("/api/monthly_view", formdata).then((res) => {
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
    { name: "Id", selector: "id", sortable: true },
    { name: " Store No", selector: "store_no", sortable: true },
    { name: "Store Code", selector: "store_code", sortable: true },
    { name: "Store Name", selector: "store_name", sortable: true },
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
        <Typography variant="h4">Month Report</Typography>&nbsp;&nbsp;&nbsp;
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
            print={false}
            pagination
            highlightOnHover
          />
        </DataTableExtensions>
      </Box>
      {/* <Stack direction="row " spacing={15}>
        <Typography variant="h4">Monthly Report</Typography>&nbsp;&nbsp;&nbsp;
        <ReactToExcel
          table="html-excel"
          filename="monthreport"
          buttonText="DOWNLOAD"
        />
        &nbsp;&nbsp;
        <Button
          variant="contained"
          color="warning"
          sx={{
            fontWeight: "bold",
          }}
          onClick={downloadZip}
        >
          Download
        </Button>
      </Stack>
    <Box
      sx={{
          p:5,
          display: "flex",
          flexDirection: "column",
          height:600,
          width:1100,
          overflow: "hidden",
      }}>
      <TableContainer >
       
          <Table stickyHeader id="html-excel" aria-label="sticky table"size="small" >
            <TableHead sx={{ backgroundColor: "#d9d9d9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Id
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Store No
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Store Code
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Store Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Store Opening Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  City
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  State
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Region
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Status of Store
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Footage(m2)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Footage(ft2)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  SEPARATE ELEC BILLING?
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  SEPARATE DG BILLING?
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px", width:'100px'}}>
                  Bill Received 
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Bill Paid Direct or Landlord
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service From
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service To
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Elec - kWh
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service From
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service To
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  DG - kWh
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service From
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Service To
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  HAVC-kW
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  R22-kg
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  R404-kg
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  R407-kg{" "}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Other-Kg{" "}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Average taken as no update from store
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  change in sq ft in the store
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Store closed
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  New Store{" "}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Closed store due to Lock down
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                  Notes
                </TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <></>
            ) : (
              data.map((data) => (
                <TableBody sx={{ backgroundColor: "#f9f2e8" }}>
                  <TableRow>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.store_no}</TableCell>
                    <TableCell>{data.store_code}</TableCell>
                    <TableCell>{data.store_name}</TableCell>
                    <TableCell>{data.store_opening_date}</TableCell>
                    <TableCell>{data.city}</TableCell>
                    <TableCell>{data.state}</TableCell>
                    <TableCell>{data.region}</TableCell>
                    <TableCell>{data.type}</TableCell>
                    <TableCell>{data.status_of_store}</TableCell>
                    <TableCell>{data.footage_m2}</TableCell>
                    <TableCell>{data.footage_ft2}</TableCell>
                    <TableCell>{data.seperate_elec_billing}</TableCell>
                    <TableCell>{data.seperate_dg_billing}</TableCell>
                    <TableCell>
                      {data.bill_received_by_store__sent_direct_to_ho}
                    </TableCell>
                    <TableCell>{data.bill_paid_direct_or_landlord}</TableCell>
                    <TableCell>{data.service_from}</TableCell>
                    <TableCell>{data.service_to}</TableCell>
                    <TableCell>{data.elec_kwh}</TableCell>
                    <TableCell>{data.service_from1}</TableCell>
                    <TableCell>{data.service_to1}</TableCell>
                    <TableCell>{data.dg_kwh}</TableCell>
                    <TableCell>{data.service_from2}</TableCell>
                    <TableCell>{data.service_to2}</TableCell>
                    <TableCell>{data.hvac_kwh}</TableCell>
                    <TableCell>{data.r22_kg}</TableCell>
                    <TableCell>{data.r404_kg}</TableCell>
                    <TableCell>{data.r407_kg}</TableCell>
                    <TableCell>{data.other__kg}</TableCell>
                    <TableCell>
                      {data.average_taken_as_no_update_from_store}
                    </TableCell>
                    <TableCell>{data.change_in_sq_ft_in_the_store}</TableCell>
                    <TableCell>{data.store_closed}</TableCell>
                    <TableCell>{data.new_store}</TableCell>
                    <TableCell>{data.closed_store_due_to_lock_down}</TableCell>
                    <TableCell>{data.notes}</TableCell>
                  </TableRow>
                </TableBody>
              ))
            )}
          </Table>
        </TableContainer>
        {loading && (
        <div >
          <CircularProgress />
          <Typography variant="h4">Please wait......</Typography>
        </div>
      )}
      </Box> */}
      {/* {loading && (
        <div >
          <CircularProgress />
          <Typography variant="h4">Please wait......</Typography>
        </div>
      )} */}
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        {/* <Link to="/Dashboard/monthlyreports" style={{ underline: "none" }}>
          <ArrowBackIcon fontSize="very very small" />
          back
        </Link> */}
        <Button variant="contained" onClick={()=>navigate("/Dashboard/monthlyreports")}>Back</Button>
      </Grid>
    </Box>
  );
}

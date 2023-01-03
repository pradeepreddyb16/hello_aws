import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Stack, Grid } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DataTableExtensions from "react-data-table-component-extensions";
const axios = require("axios");

export function QuaterlyViewReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    const fromDate = localStorage.getItem("from");
    const toDate = localStorage.getItem("to");
    const formdata = new FormData();

    console.log(fromDate, toDate);
    formdata.append("serv_from", fromDate);
    formdata.append("serv_to", toDate);
    await axios.post("/api/quarterly_view", formdata).then(function (res) {
      if (res.data.status === true) {
        setData(res.data.data);
        setLoading(false);
        console.log(res.data.data);

        //   localStorage.removeItem("from")
        // localStorage.removeItem("to")
      } else {
        console.log("heloooo");
      }
    });
  };
  const columns = [
    { name: " Store No", selector: "store_no", sortable: true },
    { name: "Store Code", selector: "store_code", sortable: true },
    { name: "Store Name", selector: "store_name", sortable: true },
    { name: "City", selector: "city", sortable: true },
    { name: "State", selector: "state", sortable: true },
    { name: "Region", selector: "region", sortable: true },
    { name: "Elec-Total", selector: "q2_elec_total", sortable: true },
    { name: "Elec-Average", selector: "q2_elec_average", sortable: true },
    { name: "DG-Total", selector: "q2_dg_total", sortable: true },
    { name: "DG-Average", selector: "q2_dg_average", sortable: true },
  ];
  const tableData = {
    columns,
    data,
  };
  return (
    <Box sx={{ m: 10 }}>
      <Stack direction="row ">
        <Typography variant="h4">Quarter Report</Typography>&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
      </Stack>
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
          highlightOnHover
        />
      </DataTableExtensions>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        {/* <Link to="/Dashboard/quaterlyreports">
          <ArrowBackIcon fontSize="very very small" />
          back
        </Link> */}
      <Button variant="contained" onClick={()=>navigate("/Dashboard/quaterlyreports")}>Back</Button> </Grid>
    </Box>
  );
}

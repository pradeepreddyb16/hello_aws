import {
  Typography,
  Button,
  Box,
  Grid,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ReactToExcel from "react-html-table-to-excel";
const axios = require("axios");

export function StoreInfo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    await axios.post("/api/get_all_stores").then((res) => {
      if (res.data.status === true) {
        setData(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      }
    });
  };
  return (
    <div>
      <Box sx={{ m: 9 }}>
        <div>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Grid item>
              <Typography variant="h4">Store Info</Typography>
            </Grid>
            <Grid
              direction="row"
              justifyContent="space-evenly"
              alignItems="flex-end"
            >
              <Stack direction="row " spacing={15}>
                <Button
                  variant="contained"
                  // size="small"
                  sx={{ height: "40%", width: "40%" }}
                  onClick={() => navigate("/Dashboard/addstore")}
                >
                  <b>Addstore</b>
                </Button>
                &nbsp;&nbsp;
                <ReactToExcel
                  table="html-excel"
                  filename="storeinfo"
                  buttonText="DOWNLOAD"
                  color="warning"
                />
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              p: 1,
              display: "flex",
              height: 500,
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table stickyHeader size="small" id="html-excel">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Store Id</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Store No.</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Store Code</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>UID</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Store Name</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography sx={{ width: "50px" }}> Date</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>State</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>City</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Region</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Type</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Status of Store</Typography>
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Footage</Typography>
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#2f7d32",color:"white" }}>
                      <Typography>Edit</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                {loading ? (
                  <></>
                ) : (
                  data.map((data) => (
                    <TableBody sx={{ backgroundColor: "white" }}>
                      <TableRow>
                        <TableCell>{data.store_id}</TableCell>
                        <TableCell>{data.store_no}</TableCell>
                        <TableCell>{data.store_code}</TableCell>
                        <TableCell>{data.user_ids}</TableCell>
                        <TableCell>{data.store_name}</TableCell>
                        <TableCell>{data.opening_date}</TableCell>
                        <TableCell>{data.store_state}</TableCell>
                        <TableCell>{data.store_city}</TableCell>
                        <TableCell>{data.store_region}</TableCell>
                        <TableCell>{data.store_type}</TableCell>
                        <TableCell>{data.store_status}</TableCell>
                        <TableCell>{data.store_foot_m2}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              navigate(`/Dashboard/editstore/${data.store_id}`)
                            }
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))
                )}
              </Table>
            </TableContainer>
            {loading && (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h4">Please wait.....</Typography>
              </div>
            )}
          </Box>
        </div>
      </Box>
    </div>
  );
}

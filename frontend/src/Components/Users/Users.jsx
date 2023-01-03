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
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
const axios = require("axios");

export function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    await axios.get("/api/select").then((res) => {
      if (res.data.status === true) {
        setData(res.data.data);
        setLoading(false);
        console.log(res.data.data);
      }
    });
  };

  return (
    <Box sx={{ m: 10 }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Typography variant="h4">Users list</Typography>
        <Grid>
          <Button
            variant="contained"
            // size="small"
            onClick={() => navigate("/Dashboard/adduser")}
          >
            <b>Add User</b>
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          height: 400,
          width: 1000,
          overflow: "hidden",
        }}
      >
        <TableContainer component={Paper}>
          <Table stickyHeader size="small">
            <TableHead >
              <TableRow>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>ID  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Name  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Email  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Mobile  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Role  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Status  </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Reg_date</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>Edit</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <></>
            ) : (
              data.map((data) => (
                <TableBody >
                  <TableRow>
                    <TableCell>{data.admin_id}</TableCell>
                    <TableCell>{data.admin_name}</TableCell>
                    <TableCell>{data.admin_email}</TableCell>
                    <TableCell>{data.admin_mobile}</TableCell>
                    <TableCell>
                      {data.admin_role === 1 && "super ADMIN"}
                      {data.admin_role === 2 && "ADMIN"}
                      {data.admin_role === 3 && "Store Owner"}
                    </TableCell>
                    <TableCell>
                      {data.admin_status === 1 ? "Active" : "InActive"}
                    </TableCell>
                    <TableCell>{data.admin_regdate}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/Dashboard/edituser/${data.admin_id}`)
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
    </Box>
  );
}

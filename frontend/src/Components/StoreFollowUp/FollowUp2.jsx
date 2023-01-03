import React, { useState, useContext } from "react";
import { SnackContext } from "../Context/UserContext";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  TableCell,
  Paper,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
const axios = require("axios");

export function FollowUp2() {
  const [month, setMonth] = useState();
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
  const { snack, setSnack } = useContext(SnackContext);
  const [open, setOpen] = useState(false);
  const [store_no, setStore_no] = useState();
  const [follow_1, setFollow_1] = useState();
  const [follow_2, setFollow_2] = useState();
  const [follow_3, setFollow_3] = useState();
  const [bill_paid, setBill_paid] = useState();
  const [notes, setNotes] = useState();
  const month_name = [
    { id: "01-2022", month: "january" },
    { id: "02-2022", month: "february" },
    { id: "03-2022", month: "march" },
    { id: "04-2022", month: "april" },
    { id: "05-2022", month: "may" },
    { id: "06-2022", month: "june" },
    { id: "07-2022", month: "july" },
    { id: "08-2022", month: "august" },
    { id: "09-2022", month: "september " },
    { id: "10-2022", month: "october" },
    { id: "11-2022", month: "november" },
    { id: "12-2022", month: "december" },
  ];
 
  const monthSubmit = async (e) => {
    e.preventDefault();
    console.log(month);
    const formdata = new FormData();
    formdata.append("month", month);
    await axios.post("/api/follow_monthly", formdata).then(function(res) {
      console.log("hi");
      if (res.data.status === true) {
        console.log(month);
        console.log(res.data.data);
        setData(res.data.data);
        setLoading(false);
        setSnack({
          message: res.data.msg,
          type: "success",
          open: true,
        });
      } else {
        setSnack({
          message: res.data.msg,
          type: "error",
          open: true,
        });
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("month", month);
    formdata.append("store_no", store_no);
    formdata.append("follow1", follow_1);
    formdata.append("follow2", follow_2);
    formdata.append("follow3", follow_3);
    formdata.append("bill_paid", bill_paid);
    formdata.append("mms", notes);
    await axios.post("/api/edit_follow", formdata).then(function(res) {
      console.log("hiiiiiii");
      if (res.data.status === true) {
        setOpen(false);
        const form_data = new FormData();
        form_data.append("month", month);
        axios.post("/api/follow_monthly", formdata).then(function(resp) {
          console.log("hi");
          if (resp.data.status === true) {
            console.log(month);
            console.log(resp.data.data);
            setData(resp.data.data);
          }
        });
        setSnack({
          message: res.data.msg,
          type: "success",
          open: true,
        });
        // monthSubmit();
      } else {
        setSnack({
          message: res.data.msg,
          type: "error",
          open: true,
        });
      }
    });
  };
  return (
    <Box sx={{ m: 12, height: "500px" }}>
      <form onSubmit={monthSubmit}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <TextField
            select
            fullwidth
            size="small"
            label="Month"
            name="month"
            variant="outlined"
            value={month}
            sx={{
              borderRadius: "8px",
              width: "10%",
            }}
            onChange={(e) => setMonth(e.target.value)}
          >
            {month_name.map((months) => (
              <MenuItem value={months.month}>{months.month}</MenuItem>
            ))}
          </TextField>
          &nbsp;&nbsp;
          <Button type="submit" variant="contained">
            search
          </Button>
        </Grid>
      </form>
      <Box sx={{ m: 2, height: 500, display: "flex", overflow: "hidden" }}>
        <TableContainer component={Paper} sx={{ backgroundColor: "#f9f2e8" }}>
          <Table stickyHeader size="small">
            <TableHead sx={{ backgroundColor: "#2f7d32",color:"white" }}>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>ID</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Store No.</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Store Code</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Store Name</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography> POC Name</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography> POC Mob. </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>M&S Email </Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography> follow-1</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography> follow-2</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography> follow-3</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>Bill Paid</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}>
                  <Typography>MMS</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#2f7d32",color:"white"}}></TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <></>
            ) : (
              data.map((data) => (
                <TableBody sx={{ backgroundColor: "white"}}>
                  <TableRow>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.store_no}</TableCell>
                    <TableCell>{data.store_code}</TableCell>
                    <TableCell>{data.store_name}</TableCell>
                    <TableCell>{data.poc_name}</TableCell>
                    <TableCell>{data.poc_no}</TableCell>
                    <TableCell>{data.poc_email}</TableCell>
                    <TableCell>{data.follow1}</TableCell>
                    <TableCell>{data.follow2}</TableCell>
                    <TableCell>{data.follow3}</TableCell>
                    <TableCell>{data.bill_paid}</TableCell>
                    <TableCell>{data.mms}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          // editData(data.store_no);
                          setStore_no(data.store_no);
                          setFollow_1(data.follow1);
                          setFollow_2(data.follow2);
                          setFollow_3(data.follow3);
                          setBill_paid(data.bill_paid);
                          setNotes(data.mms);
                          setOpen(true);
                        }}
                      >
                        edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))
            )}
          </Table>
        </TableContainer>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>
                <Box
                  sx={{
                    height: "490px",
                    width: "200px",
                  }}
                >
                   <TextField
                    size="small"
                    name="month"
                    label="Month"
                    value={month}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setMonth(e.target.value)}
                  ></TextField>
                  <TextField
                    size="small"
                    name="storeno"
                    label="Store No."
                    value={store_no}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setStore_no(e.target.value)}
                  ></TextField>
                  <TextField
                    select
                    size="small"
                    name="first_follow"
                    label="Firstfollowup"
                    value={follow_1}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setFollow_1(e.target.value)}
                  >
                    <MenuItem value="">--None--</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    name="second_follow"
                    label="Secondfollowup"
                    value={follow_2}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setFollow_2(e.target.value)}
                  >
                    <MenuItem value="">--None--</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    variant="outlined"
                    name="third_follow"
                    label="Thirdfollowup"
                    value={follow_3}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setFollow_3(e.target.value)}
                  >
                    <MenuItem value="">--None--</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    name="bill_received"
                    label="BillReceived"
                    value={bill_paid}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setBill_paid(e.target.value)}
                  >
                    <MenuItem value="">--None--</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    name="notes"
                    label="MMS"
                    value={notes}
                    sx={{ m: 2, width: "80%" }}
                    onChange={(e) => setNotes(e.target.value)}
                  ></TextField>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <Button
                  size="small"
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  back
                </Button>
                <Button size="small" variant="contained" type="submit">
                  save
                </Button>
              </Grid>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
}

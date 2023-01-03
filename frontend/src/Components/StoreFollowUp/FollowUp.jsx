import React, { useState, useEffect, useContext } from "react";
import {
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogContentText,
  Grid,
  Paper,
  TextField,
  MenuItem,Typography
} from "@mui/material";
import { SnackContext } from "../Context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
const axios = require("axios");

export function FollowUp() {
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

  useEffect(() => {
    getdata();
  }, []);
  const getdata = async () => {
    await axios.get("/api/follow_monthly").then((res) => {
      if (res.data.status === true) {
        console.log(res.data.data);
        setData(res.data.data);
        setLoading(false);
        console.log(data);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("store_no", store_no);
    formdata.append("follow1", follow_1);
    formdata.append("follow2", follow_2);
    formdata.append("follow3", follow_3);
    formdata.append("bill_paid", bill_paid);
    formdata.append("notes", notes);
    await axios.post("/api/edit_follow", formdata).then(function(res) {
      console.log("hiiiiiii");
      if (res.data.status === true) {
        setOpen(false);
        setSnack({
          message: res.data.msg,
          type: "success",
          open: true,
        });
        getdata();
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
    <Box
      sx={{
        p: 1,
        m: 10,
        display: "flex",
        flexDirection: "column",
        height: 500,
        width: 1000,
        overflow: "hidden",
      }}
    >
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
                  height: "420px",
                  width: "200px",
                }}
              >
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
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead sx={{ backgroundColor: "#2f7d32" }}>
            <TableRow>
              <TableCell>
                <Typography>ID</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Store No.</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Store Code</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Store Name</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Shop POC Name</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Shop POC Mob No</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>M&S Email Id</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>1st follow-up </Typography>
              </TableCell>
              <TableCell>
                <Typography>2nd follow-up</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>3rd follow-up</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>Bill Received</Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography>MMS</Typography>{" "}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <></>
          ) : (
            data.map((data) => (
              <TableBody >
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
                  <TableCell>{data.notes}</TableCell>
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
                        setNotes(data.notes);
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
    </Box>
  );
}

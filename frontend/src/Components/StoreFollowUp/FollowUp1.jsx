import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogContentText,
} from "@mui/material";
import { Check, Save } from "@mui/icons-material";
import { green } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import { SnackContext } from "../Context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
const axios = require("axios");

export function FollowUp1() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [success, setSuccess] = useState(false);
  const { snack, setSnack } = useContext(SnackContext);
  const [rowId, setRowId] = useState();
  const [store_no, setStore_no] = useState();
  const [follow_1, setFollow_1] = useState();
  const [follow_2, setFollow_2] = useState();
  const [follow_3, setFollow_3] = useState();
  const [bill_paid, setBill_paid] = useState();
  const [notes, setNotes] = useState();
  const months = [
    { id: "1", month: "January" },
    { id: "2", month: "February" },
    { id: "3", month: "March" },
    { id: "4", month: "April" },
    { id: "5", month: "May" },
    { id: "6", month: "June" },
    { id: "7", month: "July" },
    { id: "8", month: "August" },
    { id: "9", month: "September " },
    { id: "10", month: "October" },
    { id: "11", month: "November" },
    { id: "12", month: "December" },
  ];
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
  const getDetails = async (rowId) => {
    console.log(rowId);
    const formdata = new FormData();
    formdata.append("id", rowId);
    axios.post("/api/get_single_store", formdata).then(function(res) {
      if (res.data.status === true) {
        console.log(res.data.data)
       setStore_no(res.data.data.store_no);
       setFollow_1(res.data.data.follow1)
       setFollow_2(res.data.data.follow2);
       setFollow_3(res.data.data.follow3);
       setBill_paid(res.data.data.bill_paid);
       setNotes(res.data.data.notes)
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
    console.log(rowId);
    const formdata = new FormData();
    formdata.append("id", rowId);
    formdata.append("follow1", follow_1);
    formdata.append("follow2", follow_2);
    formdata.append("follow3", follow_3);
    formdata.append("bill_paid", bill_paid);
    formdata.append("notes", notes);
    console.log("hi");
    await axios.post("/api/follow_savee", formdata).then(function(res) {
      console.log("hi");
      console.log(follow_1);
      if (res.data.status === true) {
        setSuccess(true);
        console.log(follow_1);
        alert("saved");
      }
    });
  };
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "store_no", headerName: "Store No.", width: 80 },
    { field: "store_code", headerName: "Store Code", width: 90 },
    { field: "store_name", headerName: "Store Name", width: 90 },
    { field: "poc_name", headerName: "Shop POC Name", width: 130 },
    { field: "poc_no", headerName: "Shop POC Mob No", width: 130 },
    { field: "poc_email", headerName: "M&S Email Id", width: 130 },
    {
      field: "follow1",
      headerName: "1st follow-up done on Date",
      width: 90,
      editable: true,
    },
    {
      field: "follow2",
      headerName: "2nd follow-up done on Date",
      width: 90,
      editable: true,
    },
    {
      field: "follow3",
      headerName: "3rd follow-up done on Date",
      width: 90,
      editable: true,
    },
    {
      field: "bill_paid",
      headerName: "Bill Received",
      width: 90,
      editable: true,
    },
    { field: "notes", headerName: "MMS", width: 150, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      renderCell: () => (
        <Box
          sx={{
            m: 1,
            position: "relative",
          }}
        >
          {success ? (
            <Fab
              color="primary"
              sx={{
                width: 40,
                height: 40,
                bgcolor: green[500],
                "&:hover": { bgcolor: green[700] },
              }}
            >
              <Check />
            </Fab>
          ) : (
            <Fab
              color="primary"
              sx={{
                width: 40,
                height: 40,
              }}
              onClick={getDetails}
            >
              <Save />
            </Fab>
          )}
          {loading && (
            <CircularProgress
              size={52}
              sx={{
                color: green[500],
                position: "absolute",
                top: -6,
                left: -6,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      ),
    },
  ];
  return (
    <Box sx={{ m: 12 }}>
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
                  height: "450",
                  width: "300",
                }}
              >
                {" "}
                <TextField
                  name="store_no"
                  label="Store No."
                  value={store_no}
                  sx={{ m: 2, width: "80%" }}
                  onChange={(e) => setStore_no(e.target.value)}
                ></TextField>
                <TextField
                  select
                  name="follow_1"
                  label="Firstfollowup"
                  value={follow_1}
                  sx={{ m: 2, width: "80%" }}
                  onChange={(e) => setFollow_1(e.target.value)}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
                <TextField
                  select
                  name="follow_2"
                  label="Secondfollowup"
                  value={follow_2}
                  sx={{ m: 2, width: "80%" }}
                  onChange={(e) => setFollow_2(e.target.value)}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
                <TextField
                  select
                  name="follow_3"
                  label="Thirdfollowup"
                  value={follow_3}
                  sx={{ m: 2, width: "80%" }}
                  onChange={(e) => setFollow_3(e.target.value)}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
                <TextField
                  select
                  name="bill_paid"
                  label="BillReceived"
                  value={bill_paid}
                  sx={{ m: 2, width: "80%" }}
                  onChange={(e) => setBill_paid(e.target.value)}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
                <TextField
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
                variant="contained"
                type="submit"
                onClick={() => {
                  setOpen(false);
                }}
              >
                back
              </Button>
              <Button variant="contained" type="submit">
                save
              </Button>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <TextField
          sx={{
            borderRadius: "8px",
            width: "30%",
          }}
          variant="outlined"
          select
        >
          {months.map((months) => (
            <MenuItem value={months.id}>{months.month}</MenuItem>
          ))}
        </TextField>
        &nbsp;&nbsp;
        <TextField
          sx={{
            borderRadius: "8px",
            width: "20%",
          }}
          type="number"
          defaultValue="2022"
          variant="outlined"
        />
      </Grid>
      <Box
        sx={{
          my: 5,
          height: "220%",
          width: "270%",
          backgroundColor: "#f2f2f2",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          getRowId={(row) => row.id}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          onCellEditCommit={async(param) =>{ setRowId(param.id);
            getDetails(rowId);
          //   console.log(param.id)

          //   setStore_no(data.store_no);
          //       setFollow_1(data.follow1);
          //       setFollow_2(data.follow2);
          //       setFollow_3(data.follow3);
          //       setBill_paid(data.bill_paid);
          //       setNotes(data.notes);
          //       console.log(data.store_no);
          //       setOpen(true);
          // console.log(store_no);
          // console.log(follow_3);
          // console.log(rowId);
          }}
        />
       
      </Box>
    </Box>
  );
}

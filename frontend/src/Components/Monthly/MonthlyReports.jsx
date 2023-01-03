import {
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Grid,
  TextField,
  Box,
  TableBody,
  Button,
  Typography,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { SnackContext, UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
const axios = require("axios");

export function MonthlyReports() {
  const { userProfile, setUserProfile } = useContext(UserContext);
  const { snack, setSnack } = useContext(SnackContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(undefined);
  const [name, setName] = useState();
  const [disable, setDisable] = useState(false);
  // const [anchorEl, setAnchorEl] = React.useState(null);

  // const [delete_anchorEl, setDelete_AnchorEl] = React.useState(null);
  const [dialog_open, setDialog_open] = useState(false);

  const [month_value, setMonth_value] = useState({});
  const [opend, setOpend] = useState(false);
  const [openr, setOpenr] = useState(false);
  const [opende, setOpende] = useState(false);
  // const delete_open = Boolean(delete_anchorEl);
  // const delete_id = delete_open ? "simple-popover" : undefined;
  const navigate = useNavigate();
  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    await axios.get("/api/monthly_reports").then((res) => {
      console.log("hiiiiiii");
      if (res.data.status === true) {
        console.log("hi");
        console.log(res.data.data);
        setData(res.data.data);
        // console.log(data);
        setLoading(false);
      } else {
        console.log("heloooo");
      }
    });
  };

  const handleApprove = async (tempData) => {
    console.log(month_value);
    // setDisable(true);
    // setAnchorEl(null);
    console.log("===============================");
    const formdata = new FormData();
    formdata.append("month", month_value);
    formdata.append("approve", tempData);
    formdata.append("amonth", month_value);
    formdata.append("approved_by", name);
    console.log(month_value);
    await axios.post("/api/approve_month", formdata).then(function (res) {
      console.log("hi");
      console.log(res);
      if (res.data.status === true) {
        setSnack({
          message: "successfully Approved",
          type: "success",
          open: true,
        });
        setOpend(false);
        getdata();
      }
    });
    setOpend(false);
  };
  
  const handleNotApprove = () => {
    // setAnchorEl(null);
    setDialog_open(true);
  };
  
  function handleChange(event) {
    if (event.target.length !== 0) {
      setFile(event.target.files[0]);
    }
  }
  const handleClick = async () => {
    if (file === undefined) {
      setSnack({
        message: "Please upload file...",
        type: "error",
        open: true,
      });
    } else {
      const formdata = new FormData();
      formdata.append("file_upload", file);
      await axios.post("/api/upload_file", formdata).then(function (res) {
        console.log(res);
        if (res.data.status === true) {
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
    }
  };

  const deleteReport = async () => {
    console.log(month_value);
    const formdata = new FormData();
    formdata.append("month", month_value);
    console.log("hooooo");
    await axios.post("/api/delete_month", formdata).then(function (res) {
      console.log("hiiiii");
      if (res.data.status === true) {
        console.log("=======delete===========");
        setSnack({
          message: res.data.msg,
          type: "success",
          open: true,
        });
        setOpende(false);
        getdata();
      } else {
        setSnack({
          message: res.data.msg,
          type: "error",
          open: true,
        });
        setOpende(false);
        getdata();
      }
    });
  };

  const handleReject = async (tempRej) => {
    console.log(month_value);
    //setDisable(true);
    // setAnchorEl(null);
    console.log("===============================");

    const formdata = new FormData();
    formdata.append("month", month_value);
    formdata.append("approve", tempRej);
    formdata.append("rmonth", month_value);
    formdata.append("approved_by", name);
    console.log(month_value);
    await axios.post("/api/reject", formdata).then(function (res) {
      console.log(res);
      console.log("============rejected===================");
      if (res.data.status === true) {
        setSnack({
          message: "successfully Rejected",
          type: "success",
          open: true,
        });
        setOpenr(false);
        getdata();
      }
    });
    setOpenr(false);
    getdata();
  };
  const handleNotReject = async () => {
    setOpenr(false);
    getdata();
  };
  return (
    <div>
      <Box sx={{ m: 12 }}>
        <Dialog
          open={dialog_open}
          onClose={() => {
            setDialog_open(false);
          }}
        >
          <form>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <DialogContent>
                <Typography variant="h5">
                  Enter reason for not approval
                </Typography>
                <TextField
                  name="reason"
                  multiline
                  rows={3}
                  sx={{ m: 2, width: "90%" }}
                ></TextField>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" type="submit">
                  send
                </Button>
              </DialogActions>{" "}
            </Grid>
          </form>
        </Dialog>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h4">Monthly Reports</Typography>
          {userProfile.admin_role === 1 && (
            <div>
              Upload Bills here: &nbsp;{" "}
              <Button
                variant="contained"
                component="label"
                color="success"
                onChange={handleChange}
              >
                Browse file
                <input hidden type="file" />
              </Button>{" "}
              &nbsp;{" "}
              {/* <span> <input type="file" onChange={handleChange} /></span> */}
              <Button
                variant="contained"
                color="success"
                onClick={handleClick}
                type="submit"
              >
                UPLOAD
              </Button>
            </div>
          )}
          <TextField
            sx={{
              border: "4px solid",
              borderRadius: "8px",
              borderColor: "#d9d9d9",
              width: "10%",
            }}
            type="number"
            defaultValue="2022"
            variant="outlined"
          />
        </Grid>
        <Box sx={{ my: 5 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#2f7d32" }}>
                <TableRow>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Month</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Month Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Service from</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Service to</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Approved Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Approval Button</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> View Report</Typography>
                  </TableCell>
                  <TableCell>
                    {/* <Typography sx={{color:"white"}}> Download Report</Typography>
                  </TableCell>
                  <TableCell> */}
                    <Typography  sx={{color:"white"}}> Delete Report</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Updated By</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <></>
              ) : (
                data.map((i) => (
                  <TableBody>
                    <TableRow>
                      <TableCell>{i.month}</TableCell>
                      <TableCell>{i.month_name}</TableCell>
                      <TableCell>{i.service_from}</TableCell>
                      <TableCell>{i.service_to}</TableCell>
                      <TableCell>{i.approve_status}</TableCell>

                      <TableCell>
                        <div>
                          {i.approve_status !== "approved" ? (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                  setOpend(true);
                                  setMonth_value(i.monthly);
                                  setName(userProfile.admin_name);
                                  console.log(month_value);
                                }}
                                disabled={disable === true ? true : false}
                              >
                                Approve
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  setOpenr(true);
                                  setMonth_value(i.monthly);
                                  setName(userProfile.admin_name);
                                  console.log(name);
                                }}
                                disabled={disable === true ? true : false}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => {
                            localStorage.setItem("month", i.monthly);
                            navigate("/Dashboard/monthlyviewreport");
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                      {/* <TableCell>
                        <Button variant="contained" color="info">
                          Download
                        </Button>
                      </TableCell> */}
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            setMonth_value(i.monthly);
                            setOpende(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                      <TableCell>{i.approved_by}</TableCell>
                    </TableRow>
                  </TableBody>
                ))
              )}
            </Table>
          </TableContainer>
        </Box>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="h4">Please wait......</Typography>
          </div>
        )}
        <Dialog
          open={opend}
          onClose={() => {
            setOpend(false);
          }}
        >
          <Box sx={{ p: 2, backgroundColor: "#f9f2e8" }}>
            <Typography sx={{ p: 1 }}>Are you sure to approve</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleApprove("approved");
              }}
            >
              Yes
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleNotApprove();
              }}
            >
              No
            </Button>
          </Box>
        </Dialog>
        <Dialog
          open={openr}
          onClose={() => {
            setOpenr(false);
          }}
        >
          <Box sx={{ p: 2, backgroundColor: "#f9f2e8" }}>
            <Typography sx={{ p: 1 }}>Are you sure to Reject</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleReject("rejected");
              }}
            >
              Yes
            </Button>
            &nbsp;&nbsp;
            <Button variant="contained" color="error" onClick={handleNotReject}>
              No
            </Button>
          </Box>
        </Dialog>
        <Dialog
          open={opende}
          onClose={() => {
            setOpende(false);
          }}
        >
          <Box sx={{ p: 2, backgroundColor: "#f9f2e8" }}>
            <Typography sx={{ p: 1 }}>
              Are you sure to delete the file
            </Typography>
            &nbsp;{" "}
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                deleteReport();
              }}
            >
              Yes
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              color="error"
              onClick={()=> setOpende(false)}
            >
              No
            </Button>
          </Box>
        </Dialog>
      </Box>
    </div>
  );
}

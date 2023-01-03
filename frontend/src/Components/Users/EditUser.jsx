import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
} from "@mui/material";
import { SnackContext } from "../Context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
const axios = require("axios");

export function EditUser() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { snack, setSnack } = useContext(SnackContext);
  const[err,setErr]=useState();
  const [user, setUser] = useState({
    name: "",
    email_id: "",
    mobilenumber: "",
    role: "",
    status: "",
  });
  const userChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const { name, email_id, mobilenumber, role, status } = user;
  useEffect(() => {
    getdata();
  }, []);
  const getdata = async() => {
    const formdata = new FormData();
    formdata.append("admin_id", id);
    await axios.post("/api/single", formdata).then(function(res) {
      if (res.data.status === true) {
        setSnack({
          message: res.data.msg,
          type: "success",
          open: true,
        });
        setUser({
          name: res.data.data.admin_name,
          email_id: res.data.data.admin_email,
          mobilenumber: res.data.data.admin_mobile,
          role: res.data.data.admin_role,
          status: res.data.data.admin_status,
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
  const userSubmit = async(e) => {
    e.preventDefault();
    if (name.length < 1) {
      setErr(1);
      setSnack({
        message: "Enter your name",
        type: "error",
        open: true,
      });
    } else if (email_id.length < 1) {
      setErr(2);
      setSnack({
        message: "Enter your emailid",
        type: "error",
        open: true,
      });
    } else if (!email_id.includes("@")) {
      setErr(2);
      setSnack({
        message: "Enter proper emailid",
        type: "error",
        open: true,
      });
    } else if (mobilenumber.length < 1) {
      setErr(3);
      setSnack({
        message: "Enter your mobilenumber",
        type: "error",
        open: true,
      });
    } else if (mobilenumber.length !== 10) {
      setErr(4);
      setSnack({
        message: "Enter proper mobilenumber",
        type: "error",
        open: true,
      });
    } else if (role.length < 1) {
      setErr(5);
      setSnack({
        message: "Please Enter a Valid role...",
        type: "error",
        open: true,
      });
    } else if (status.length === 0) {
      setErr(6);
      setSnack({
        message: "Please Enter status...",
        type: "error",
        open: true,
      });
    } else {
      const formdata = new FormData();
      formdata.append("admin_id", id);
      formdata.append("admin_name", name);
      formdata.append("admin_email", email_id);
      formdata.append("admin_mobile", mobilenumber);
      formdata.append("admin_role", role);
      formdata.append("admin_status", status);
      console.log(formdata);
      await axios.post("/api/edit", formdata).then(function(res) {
        console.log(res);
        if (res.data.status === true) {
          setSnack({
            message: res.data.msg,
            type: "success",
            open: true,
          });
          navigate("/Dashboard/Users");
        } else {
          setSnack({
            message: res.data.msg,
            type: "error",
            open: true,
          });
        }
      });
      console.log(mobilenumber);
    }
  };
  return (
    <Box
      sx={{
        borderRadius: "10px",
        // backgroundColor: "#f2f2f2",
        my: 12,
        mx:15,
        px: 9,
        py: 3,
        width: "60%",
        boxShadow:5
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h3">Enter user details</Typography>
        <form onSubmit={userSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            size="small"
            color={err===1?"error":""}
            focused={err===1?true:false}
            value={name}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="email_id"
            variant="outlined"
            name="email_id"
            size="small"
            color={err===2?"error":""}
            focused={err===2?true:false}
            value={email_id}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="mobilenumber"
            variant="outlined"
            type="number"
            name="mobilenumber"
            size="small"
            color={err===3?"error":""}
            focused={err===3?true:false}
            value={mobilenumber}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Role"
            variant="outlined"
            name="role"
            size="small"
            color={err===4?"error":""}
            focused={err===4?true:false}
            select
            value={role}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          >
            <MenuItem value={1}>Super Admin</MenuItem>
            <MenuItem value={2}>Admin</MenuItem>
            <MenuItem value={3}>Store Owner</MenuItem>
          </TextField>
          <TextField
            label="status"
            variant="outlined"
            name="status"
            size="small"
            color={err===5?"error":""}
            focused={err===5?true:false}
            value={status}
            select
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>InActive</MenuItem>
          </TextField>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={() => navigate("/Dashboard/users")}
            >
              Back
            </Button>
            &nbsp;&nbsp;
            <Button type="submit" variant="contained">
              Submit
            </Button></Grid>
        </form>
      </Grid>
    </Box>
  );
}

import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { SnackContext } from "../Context/UserContext";
import {useNavigate } from "react-router-dom";
const axios = require("axios");

export function AddUser() {
  const { snack, setSnack } = useContext(SnackContext);
  const navigate = useNavigate();
  const[err,setErr]=useState();
  const [user, setUser] = useState({
    name: "",
    email_id: "",
    mobilenumber: "",
    password: "",
    repassword: "",
    role: "",
    reg_date: "",
  });
  const [status, setStatus] = useState(1);

  const userChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const {
    name,
    email_id,
    mobilenumber,
    password,
    repassword,
    role,
    reg_date,
  } = user;
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
      setErr(3);
      setSnack({
        message: "Enter proper mobilenumber",
        type: "error",
        open: true,
      });
    } else if (password.length === 0) {
      setErr(4);
      setSnack({
        message: "Please Enter Password...",
        type: "error",
        open: true,
      });
    } else if (password.length < 6) {
      setErr(4);
      setSnack({
        message: "password should contain 6 characters...",
        type: "error",
        open: true,
      });
    } else if (repassword.length === 0) {
      setErr(5);
      setSnack({
        message: "Please confirm your password...",
        type: "error",
        open: true,
      });
    } else if (repassword !== password) {
      setErr(5);
      setSnack({
        message: "password doesn't match...",
        type: "error",
        open: true,
      });
    } else if (role.length < 1) {
      setErr(6);
      setSnack({
        message: " Please enter a valid role",
        type: "error",
        open: true,
      });
    } else if (status.length < 1) {
      setErr(7);
      setSnack({
        message: "Please enter status... ",
        type: "error",
        open: true,
      });
    } else {
      const formdata = new FormData();
      formdata.append("admin_name", name);
      formdata.append("admin_email", email_id);
      formdata.append("admin_mobile", mobilenumber);
      formdata.append("admin_pass", password);
      formdata.append("admin_repass", repassword);
      formdata.append("admin_role", role);
      formdata.append("status", status);

      await axios.post("/api/add", formdata).then(function(res) {
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
        mx: 15,
        my: 10,
        px: 13,
        py: 1,
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
        <Typography variant="h4">Enter user details</Typography>
        <form onSubmit={userSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            color={err===1?"error":""}
            focused={err===1?true:false}
            value={name}
            size="small"
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Email_id"
            variant="outlined"
            name="email_id"
            color={err===2?"error":""}
            focused={err===2?true:false}
            value={email_id}
            size="small"
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Mobilenumber"
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
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            size="small"
            color={err===4?"error":""}
            focused={err===4?true:false}
            value={password}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Confirm password"
            variant="outlined"
            name="repassword"
            type="password"
            size="small"
            color={err===5?"error":""}
            focused={err===5?true:false}
            value={repassword}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            id="select"
            label="Role"
            name="role"
            size="small"
            color={err===6?"error":""}
            focused={err===6?true:false}
            value={role}
            select
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
            id="select"
            label="Status"
            name="status"
            size="small"
            color={err===7?"error":""}
            focused={err===7?true:false}
            value={status}
            select
            onChange={(e) => {
              setStatus(e.target.value);
            }}
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

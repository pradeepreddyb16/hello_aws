import { TextField, Button, Typography, Box, Grid } from "@mui/material";
import React, { useState, useContext } from "react";
import { SnackContext } from "./Context/UserContext";
const axios = require("axios");

export function ContactUs() {
  const { snack, setSnack } = useContext(SnackContext);
  const [err, setErr] = useState();
  const [user, setUser] = useState({
    name: "",
    mobilenumber: "",
    email_id: "",
    location: "",
    subject: "",
    message: "",
  });
  const { name, mobilenumber, email_id, location, subject, message } = user;
  const userChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
      setErr(3);
      setSnack({
        message: "Enter proper mobilenumber",
        type: "error",
        open: true,
      });
    } else if (location.length < 1) {
      setErr(4);
      setSnack({
        message: "Enter your location",
        type: "error",
        open: true,
      });
    } else if (subject.length < 1) {
      setErr(5);
      setSnack({
        message: "Enter your subject",
        type: "error",
        open: true,
      });
    } else if (message.length < 1) {
      setErr(6);
      setSnack({
        message: "Enter your message",
        type: "error",
        open: true,
      });
    } else {
      console.log(name);
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("email", email_id);
      formdata.append("mobile_no", mobilenumber);
      formdata.append("location", location);
      formdata.append("subject", subject);
      formdata.append("message", message);
      console.log(formdata);
      await axios.post("/api/contact", formdata).then(function(res) {
        console.log(res);
        if (res.data.status === true) {
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
    }
  };
  return (
    <Box
      sx={{
        borderRadius: "10px",
        backgroundColor: "#f2f2f2",
         mx: 35,
        my: 12,
        px: 13,
        py: 3,
        width: "60%",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4">Enter your details</Typography>
        <form onSubmit={userSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            name="name"
            size="small"
            color={err === 1 ? "error" : ""}
            focused={err === 1 ? true : false}
            value={name}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email_id"
            size="small"
            color={err === 2 ? "error" : ""}
            focused={err === 2 ? true : false}
            value={email_id}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Mobile"
            variant="outlined"
            name="mobilenumber"
            size="small"
            color={err === 3 ? "error" : ""}
            focused={err === 3 ? true : false}
            value={mobilenumber}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Location"
            variant="outlined"
            name="location"
            size="small"
            color={err === 4 ? "error" : ""}
            focused={err === 4 ? true : false}
            value={location}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Subject"
            variant="outlined"
            name="subject"
            size="small"
            color={err === 5 ? "error" : ""}
            focused={err === 5 ? true : false}
            value={subject}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={3}
            name="message"
            color={err === 6 ? "error" : ""}
            focused={err === 6 ? true : false}
            value={message}
            onChange={userChange}
            sx={{
              width: "100%",
              m: 2,
            }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "100%",
              m: 2,
            }}
          >
            Submit
          </Button>
        </form>
      </Grid>
    </Box>
  );
}

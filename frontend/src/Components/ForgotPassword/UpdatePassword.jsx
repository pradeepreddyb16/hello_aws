import React, { useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";

export const ValidateEmail = () => {
  const [email, setEmail] = useState();
  const [err, setErr] = useState();
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState();
  const [new_pwd, setNew_pwd] = useState();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState();
   const navigate = useNavigate();

  let regEmail = /^[a-z0-9+_.-]+@[a-z0-9.-]+$/;

  const ResetPassword = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      setErr(3);
    } else if (!regEmail.test(email)) {
      setErr(4);
    } else if (pwd.length === 0) {
      setErr(5);
    } else if (new_pwd.length === 0) {
      setErr(6);
    } else if (new_pwd !== pwd) {
      setErr(7);
    } else {
      setErr();
      setDisable(true);
      const formdata = new FormData();
      formdata.append("mail", email);
      formdata.append("pas", new_pwd);
      await axios.post("/api/update_password", formdata).then(function (res) {
        if (res.data.status === true) {
          console.log("hiii");
          setDisable(false);
          setOpen(false);
          navigate("/");
        } else {
          console.log("not updated");
        }
      });
      console.log(pwd);
    }
  };

  const emailSubmit =  (e) => {
    setLoading(true);
    e.preventDefault();
    if (email.length === 0) {
      setErr(1);
    } else if (!regEmail.test(email)) {
      setErr(2);
    } else {
      setErr();
      const formdata = new FormData();
      formdata.append("uname", email);
      axios.post("/api/forgot_password", formdata).then(function (res) {
        if (res.data.status === true) {
          setLoading(false);
          setOpen(true);
        }else{
            console.log("wrong");
            console.log(res.data.status);
        }
      });
    }
    console.log(email);
    
  };
  return (
    <Container>
      <Box sx={{ m: 15, p: 2, boxShadow: 5 }}>
        <form onSubmit={emailSubmit}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            {" "}
            <Grid item lg={6} md={6} xs={12}>
              <Typography variant="h4">Enter Your Email</Typography>
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullwidth
                size="small"
                type="text"
                name="email"
                label="Email"
                value={email}
                color={err === 1 || err === 2 ? "error" : ""}
                focused={err === 1 || err === 2 ? true : false}
                helperText={
                  err === 1
                    ? "email should not be empty"
                    : "" || err === 2
                    ? "Invalid email"
                    : ""
                }
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                sx={{ m: 2 }}
              />
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              <Button
                variant="contained"
                type="submit"
                size="small"
                fullwidth
                sx={{ m: 2 }}
              >
                next
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText>
            <Box>
              <form onSubmit={ResetPassword}>
                <Grid
                  container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5">Reset Password</Typography>
                  <br />
                  <Grid item lg={6} md={6} xs={12}>
              <TextField
                fullwidth
                size="small"
                type="text"
                name="email"
                label="Email"
                value={email}
                color={err === 3 || err === 6? "error" : ""}
                focused={err === 3 || err === 4 ? true : false}
                helperText={
                  err === 3
                    ? "email should not be empty"
                    : "" || err === 4
                    ? "Invalid email"
                    : ""
                }
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                sx={{ m: 2 }}
              />
            </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      size="small"
                      type="password"
                      name="pwd"
                      label="New Password"
                      value={pwd}
                      color={err === 5 ? "error" : ""}
                      focused={err === 5 ? true : false}
                      helperText={
                        err === 5 ? "password should not be empty" : ""
                      }
                      onChange={(e) => {
                        setPwd(e.target.value);
                      }}
                      sx={{ m: 2 }}
                      fullwidth
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      size="small"
                      type="password"
                      name="new_pwd"
                      label="Confirm Password"
                      value={new_pwd}
                      color={err === 6|| err === 7? "error" : ""}
                      focused={err === 6|| err === 7? true : false}
                      helperText={
                        err ===6
                          ? "password should not be empty"
                          : "" || err === 7
                          ? "password doesn't match"
                          : ""
                      }
                      onChange={(e) => {
                        setNew_pwd(e.target.value);
                      }}
                      sx={{ m: 2 }}
                      fullwidth
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      size="small"
                      fullwidth
                      disabled={disable === true ? true : false}
                      sx={{ m: 2 }}
                    >
                      Reset
                    </Button>{" "}
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
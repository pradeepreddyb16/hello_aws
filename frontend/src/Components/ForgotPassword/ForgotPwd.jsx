import axios from "axios";
import React from "react";
import { useState } from "react";
import { Grid, Container, TextField, Button, Box, Typography } from "@mui/material";

export const ForgotPwd = () => {
  const [pwd, setPwd] = useState();
  const [new_pwd, setNew_pwd] = useState();
  const [err, setErr] = useState();
  const [disable, setDisable] = useState(false);

  const ResetPassword = async (e) => {
    console.log("a")
    e.preventDefault();
    if (pwd.length === 0) {
      setErr(1);
    } else if (new_pwd.length === 0) {
      setErr(2);
    } else if (new_pwd !== pwd) {
      setErr(3);
    } else {
        console.log("d")
      setErr();
      setDisable(true);
      const formdata = new FormData();
      formdata.append("", pwd);
      formdata.append("", new_pwd);
      await axios.post("", formdata).then(function (res) {
        if (res.data.data === true) {
          console.log("hiii");
          alert("successful");
          setDisable(false);
        } else {
          console.log("not updated");
        }
      });
    console.log(pwd)
    }
  };
  return (
    <Container>
      <Box
        sx={{
          m: 10,
          p: 3,
          height: "80%",
          width: "50%",
          boxShadow: 5,
        }}
      >
        <form onSubmit={ResetPassword}>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Reset Password</Typography><br/>
            <Grid item lg={6} md={6} xs={12}>
              <TextField
                size="small"
                type="password"
                name="pwd"
                label="New Password"
                value={pwd}
                color={err === 1 ? "error" : ""}
                focused={err === 1 ? true : false}
                helperText={err === 1 ? "password should not be empty" : ""}
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
                color={err === 2||err===3 ? "error" : ""}
                focused={err === 2||err===3? true : false}
                helperText={
                  err === 2
                    ? "password should not be empty"
                    : "" || err === 3
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
    </Container>
  );
};
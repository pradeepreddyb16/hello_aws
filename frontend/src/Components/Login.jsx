import {
  TextField,
  Button,
  Box,
  Dialog,
  Grid,
  Container,
  Typography,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate ,Link} from "react-router-dom";
import ms from "../Images/ms.jpeg";
import { SnackContext, UserContext } from "./Context/UserContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const axios = require("axios");

export function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    mobilenumber: "",
    password: "",
    showPassword: false,
  });
  const { mobilenumber, password, showPassword } = user;
  const { userProfile, setUserProfile } = useContext(UserContext);
  const { snack, setSnack } = useContext(SnackContext);
  const userChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const [otpOpen, setOtpOpen] = useState(false);
  //const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState();
  const [disable, setDisable] = useState(false);
  const handleClickShowPassword = () => {
    setUser({
      ...user,
      showPassword: !showPassword,
    });
  };
  //login with mobile and password....
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobilenumber.length === 0) {
      setErr(1);
      setSnack({
        message: "Please enter a  mobile number or emailid...",
        color: "error",
        type: "error",
        open: true,
      });
    } else if (isNaN(mobilenumber) && !mobilenumber.includes("@")) {
      setErr(1);
      setSnack({
        message: "Please enter a valid emailid...",
        color: "error",
        type: "error",
        open: true,
      });
    } else if (!isNaN(mobilenumber) && mobilenumber.length !== 10) {
      setErr(1);
      setSnack({
        message: "Please enter a valid mobile number...",
        color: "error",
        type: "error",
        open: true,
      });
    } else if (password.length === 0) {
      setErr(2);
      setSnack({
        message: "Please Enter a Password...",
        color: "error",
        type: "error",
        open: true,
      });
    } else if (password.length < 6) {
      setErr(2);
      setSnack({
        message: "password length should be 6 characters...",
        color: "error",
        type: "error",
        open: true,
      });
    } else {
      setErr();
      setDisable(true);
      setLoading(true);
      console.log(mobilenumber);
      const formdata = new FormData();
      formdata.append("uname", mobilenumber);
      formdata.append("pass", password);
      await axios.post("/api/login", formdata).then(function(res) {
        if (res.data.status === true) {
          // setOpen(false);
          setSnack({
            message: res.data.msg,
            color: "green",
            type: "success",
            open: true,
          });
          setLoading(false);
          setOtpOpen(true);
        } else {
          setLoading(false);
          setDisable(false);
          setSnack({
            message: res.data.msg,
            color: "error",
            type: "error",
            open: true,
          });
        }
      });
    }
  };
  // verfication with otp
  const submitOtp = async (e) => {
    e.preventDefault();
    if (otp.length === 0) {
      setSnack({
        message: "Please Enter OTP",
        color: "green",
        type: "error",
        open: true,
      });
    } else if (otp.length < 6) {
      setSnack({
        message: "otp length should be 6 characters...",
        color: "error",
        type: "error",
        open: true,
      });
    } else {
      setOtpOpen(false);
      const formdata = new FormData();
      formdata.append("otp", otp);
      formdata.append("uname", mobilenumber);
      formdata.append("pass", password);
      console.log(formdata);
      await axios.post("/api/validate_otp", formdata).then(function(res) {
        console.log(res.data);
        if (res.data.status === true) {
          setLoading(false);
          setSnack({
            message: res.data.msg,
            color: "green",
            type: "success",
            open: true,
          });
          setUserProfile(res.data.data);
          navigate("/Dashboard");
        } else {
          setLoading(false);
          setSnack({
            message: res.data.msg,
            color: "green",
            type: "error",
            open: true,
          });
          setOtpOpen(true);
        }
      });
    }
  };
  return (
    <div>
      <Container maxWidth="lg">
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 8,
            my: 20,
            mx: 12,
            p: 2,
            boxShadow: 18,
          }}
        >
          <Grid container direction="row" spacing={4}>
            <Grid item xs={12} md={6} lg={6}>
            <img
                src={ms}
                alt="marks&spencer"
                style={{ height: "90%", width: "90%" }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Box
                sx={{
                  p: 2,
                  py: 7,
                }}
              >
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="mobile/email"
                    variant="outlined"
                    name="mobilenumber"
                    size="small"
                    color={err === 1 ? "error" : ""}
                    focused={err === 1 ? true : false}
                    value={mobilenumber}
                    onChange={userChange}
                    sx={{ width: "95%", m: 2 }}
                  />
                  <TextField
                    label="password"
                    variant="outlined"
                    name="password"
                    size="small"
                    color={err === 2 ? "error" : ""}
                    focused={err === 2 ? true : false}
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={userChange}
                    sx={{ width: "95%", m: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Remember me"
                    />
                    <Typography color="red">
                    <Link to="/forgotemail" >
                                Forgot password ?
                            </Link>
                    </Typography>
                  </Grid>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={disable === true ? true : false}
                    sx={{ width: "95%", m: 2 }}
                  >
                    submit
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
          {/* otp dialogue box */}
          <Dialog open={otpOpen} onClose={() => {}}>
            <form onSubmit={submitOtp}>
              <DialogContent>
                <DialogContentText>Enter your OTP</DialogContentText>
                <TextField
                  focused
                  margin="dense"
                  id="otp"
                  label="OTP"
                  value={otp}
                  type="otp"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button type="submit">Submit OTP</Button>
              </DialogActions>
            </form>
          </Dialog>
          <Dialog open={loading} onClose={() => {}}>
            <DialogContent>
              <DialogContentText>Please wait....</DialogContentText>
            </DialogContent>
          </Dialog>
        </Box>
      </Container>
    </div>
  );
}

import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Box,
  MenuItem,
  TextField,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogContentText,
} from "@mui/material";
import { LeftDrawer } from "./LeftDrawer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import SupportIcon from "@mui/icons-material/Support";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { SnackContext, UserContext } from "../Context/UserContext";
import { Routers } from "./Routers";
const drawerWidth = 180;
const axios = require("axios");

export function Dashboard() {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { userProfile, setUserProfile } = useContext(UserContext);
  const { snack, setSnack } = useContext(SnackContext);
  const [showLogoutDailog, setShowLogoutDailog] = useState(false);
  const logOutAPI = async () => {
    setShowLogoutDailog(false);
    await axios.post("/api/logout").then(function(res) {
      if (res.data.status === true) {
        setSnack({
          message: res.data.msg,
          color: "green",
          type: "success",
          open: true,
        });
        setUserProfile(null);
        navigate("/");
      } else {
        setUserProfile(null);
        navigate("/");
        setSnack({
          message: res.data.msg,
          color: "error",
          type: "error",
          open: true,
        });
      }
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Dialog
        open={showLogoutDailog}
        onClose={() => {
          setShowLogoutDailog(false);
        }}
      >
        <DialogContent>
          <DialogContentText>Are you sure to Logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              logOutAPI();
            }}
          >
            YES
          </Button>
          <Button
            onClick={() => {
              setShowLogoutDailog(false);
            }}
          >
            NO
          </Button>
        </DialogActions>
      </Dialog>
      <CssBaseline />
      {/* <ThemeProvider theme={theme}> */}
      {/* <Grid item spacing={12}> */}
      <AppBar
        position="fixed"
        color="secondary"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
             <Grid item lg={8.5}md={5} xs={5}>
              <Typography align="left" variant="h3" sx={{ color: "#f9f2e8" }}>
                M&S
              </Typography>
            </Grid>
            <Grid item lg={0.3} md={1} xs={1}>
              <SupportIcon fontSize="large" />
            </Grid>
            <Grid item lg={1.3} md={2} xs={2}>
              <Button
                sx={{ color: "#f9f2e8" }}
                onClick={() => navigate("/Dashboard/urjanetsupport")}
              >
               <Typography>arcadia support</Typography> 
              </Button>
            </Grid>
            <Grid item lg={0.3} md={1} xs={1}>
              <IconButton>
                <PersonIcon fontSize="large"  sx={{ color: "#f9f2e8" }}/>
              </IconButton>
            </Grid>
            <Grid item lg={1.1} md={2} xs={2}>
            <Typography>{userProfile.admin_name.toUpperCase()}</Typography></Grid>
            <Grid item lg={0.5} md={1} xs={1}>
            <Button
                sx={{ color: "#f9f2e8" }}
                onClick={() => {
                  setShowLogoutDailog(true);
                }}
              >
               <Typography>logout</Typography> 
          </Button></Grid></Grid>
        </Toolbar>
      </AppBar>
      {/* </Grid> */}
      <LeftDrawer />
      <Routers />
      {/* </ThemeProvider> */}
    </Box>
  );
}

import "./App.css";
import React, { useState, useEffect } from "react";
import { Login } from "./Components/Login";
import { Dashboard } from "./Components/DashBoard/Dashboard";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Snackbar, Alert, Slide } from "@mui/material";
import { UserContext, SnackContext } from "./Components/Context/UserContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Loading from "./Components/Context/Loading";
import { ForgotPwd} from "./Components/ForgotPassword/ForgotPwd" 
import {ValidateEmail}from "./Components/ForgotPassword/UpdatePassword"
const axios = require("axios");

function App() {
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false,
  });
  useEffect(() => {
    checkSession();
  }, []);
  const checkSession = () => {
    setLoading(true);
    axios.post("/api/getsession").then(function(res) {
      if (res.data.status === true) {
        setUserProfile(res.data.data);
        setLoading(false)
        // setTimeout(() => setLoading(false), 1000);
      } else {
        setUserProfile(null);
        setLoading(false)
        // setTimeout(() => setLoading(false), 1000);
      }
    });
  };
  //console.log(createTheme)
  const theme = createTheme({
    palette: {
      secondary: {
        // main: "#bfbfbf",
        main: "#2f7d32",
      },
      typography: {
        fontFamily: "Poppins",
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700,
      },
    },
  });
  //console.log(theme)
  return (
    <div className="App">
 <ThemeProvider theme={theme}>
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => {
          setSnack((prevdata) => {
            return {
              ...prevdata,
              open: false,
            };
          });
        }}
        TransitionComponent={Slide}
      >
        <Alert
          variant="filled"
          onClose={() => {
            setSnack((prevdata) => {
              return {
                ...prevdata,
                open: false,
              };
            });
          }}
          severity={snack.type}
        >
          {snack.message}
        </Alert>
      </Snackbar>
     {loading?<Loading/ >: <div>
      <UserContext.Provider value={{ userProfile, setUserProfile }}>
        <SnackContext.Provider value={{ snack, setSnack }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  userProfile ? (
                      <Navigate to="/Dashboard" />
                  ):<Login />
                }
              />
              <Route
                path="/Dashboard/*"
                element={userProfile ? <Dashboard /> : <Navigate to="/" />}
              />
               < Route  path="/forgotemail" element={<ValidateEmail/>}/>
            </Routes>
          </BrowserRouter>
        </SnackContext.Provider>
      </UserContext.Provider>
      </div>}
      </ThemeProvider>
    </div>
  );
}

export default App;

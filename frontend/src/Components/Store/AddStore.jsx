import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { SnackContext } from "../Context/UserContext";
import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import countrydata from "../../countrydata.json";
const axios = require("axios");

export function AddStore() {
  const { snack, setSnack } = useContext(SnackContext);
  const navigate = useNavigate();
  const [err, setErr] = useState();
  const [store, setStore] = useState({
    num: "",
    code: "",
    uid: "",
    name: "",
    date: "",
    region: "",
    typee: "",
    statuss: "",
    footage: "",
    footagee: "",
    active_status: "",
  });
  const {
    num,
    code,
    name,
    uid,
    date,
    region,
    typee,
    statuss,
    footage,
    footagee,
    active_status,
  } = store;
  const [statename, setStateName] = useState("");
  const [city, setCity] = useState([]);
  const [cityname, setCityname] = useState("");
  const[tracker1,setTracker1] = useState();
  const[tracker2,setTracker2] = useState();
  const[tracker3,setTracker3] = useState();
  const[tracker4,setTracker4] = useState();
  const[tracker5,setTracker5] = useState();
  const[tracker6,setTracker6] = useState();
  const storeChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  const handlestate = (e) => {
    const statename = e.target.value;
    const getCitydata = countrydata.find(
      (state) => state.state_name === statename
    ).cities;
    setCity(getCitydata);
    setStateName(statename);
    console.log(statename);
  };
  const handlecity = (e) => {
    const cityname = e.target.value;
    console.log(cityname);
    setCityname(cityname);
  };

  const storeSubmit = async (e) => {
    e.preventDefault();
    if (num.length < 1) {
      setErr(1);
      setSnack({
        message: "Enter your store number...",
        type: "error",
        open: true,
      });
    } else if (code.length < 1) {
      setErr(2);
      setSnack({
        message: "Enter your store code...",
        type: "error",
        open: true,
      });
    } else if (uid.length < 1) {
      setErr(3);
      setSnack({
        message: "Enter your store uid",
        type: "error",
        open: true,
      });
    } else if (name.length < 1) {
      setErr(4);
      setSnack({
        message: "Enter your store name",
        type: "error",
        open: true,
      });
    } else if (date.length < 1) {
      setErr(5);
      setSnack({
        message: "Enter your store opening date...",
        type: "error",
        open: true,
      });
    } else if (statename.length < 1) {
      setErr(6);
      setSnack({
        message: "please select state...",
        type: "error",
        open: true,
      });
    } else if (cityname.length < 1) {
      setErr(7);
      setSnack({
        message: "Enter your city",
        type: "error",
        open: true,
      });
    } else if (region.length < 1) {
      setErr(8);
      setSnack({
        message: "please select region... ",
        type: "error",
        open: true,
      });
    } else if (typee.length < 1) {
      setErr(9);
      setSnack({
        message: "please select store type... ",
        type: "error",
        open: true,
      });
    } else if (statuss.length < 1) {
      setErr(10);
      setSnack({
        message: "please select status of store... ",
        type: "error",
        open: true,
      });
    } else if (footage.length < 1) {
      setErr(11);
      setSnack({
        message: "please select area in square meters... ",
        type: "error",
        open: true,
      });
    } else if (footagee.length < 1) {
      setErr(12);
      setSnack({
        message: "please select area in square feet... ",
        type: "error",
        open: true,
      });
    } else {
      const formdata = new FormData();
      formdata.append("store_no", num);
      formdata.append("code", code);
      formdata.append("uid", uid);
      formdata.append("name", name);
      formdata.append("open_date", date);
      formdata.append("state", statename);
      formdata.append("city", cityname);
      formdata.append("region", region);
      formdata.append("type", typee);
      formdata.append("status", statuss);
      formdata.append("foot_m2", footage);
      formdata.append("foot_ft2", footagee);
      formdata.append("active_status", active_status);
      formdata.append("tracker1", tracker1);
      await axios.post("/api/add_store", formdata).then(function(res) {
        console.log("hi");
        if (res.data.status === true) {
          setSnack({
            message: res.data.msg,
            type: "success",
            open: true,
          });
          navigate("/Dashboard/storeinfo");
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
        // backgroundColor: "#f9f2e8",
        my: 12,
        mx: 25,
        px: 5,
        py: 1,
        width: "60%",
        boxShadow:5
      }}
    >
      <Grid item justifyContent="center" alignItems="center" xs={12}>
        <Typography variant="h4">Enter store details</Typography>
      </Grid>
      <br />
      <form onSubmit={storeSubmit}>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="left"
        >
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
            size="small"
              label="Store No."
              name="num"
              type="number"
              variant="outlined"
              color={err === 1 ? "error" : ""}
              focused={err === 1 ? true : false}
              value={num}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Code"
              name="code"
              variant="outlined"
              color={err === 2 ? "error" : ""}
              focused={err === 2 ? true : false}
              value={code}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="uid"
              name="uid"
              variant="outlined"
              color={err === 3 ? "error" : ""}
              focused={err === 3 ? true : false}
              value={uid}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Name"
              name="name"
              variant="outlined"
              color={err === 4 ? "error" : ""}
              focused={err === 4 ? true : false}
              value={name}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              fullWidth
              //label="Store Opening Date"
              name="date"
              type="date"
              variant="outlined"
              color={err === 5 ? "error" : ""}
              focused={err === 5 ? true : false}
              value={date}
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              fullWidth
              id="select"
              label="state"
              name="state"
              // value={state}
              color={err === 6 ? "error" : ""}
              focused={err === 6 ? true : false}
              select
              onChange={(e) => handlestate(e)}
            >
              <MenuItem value="">--Select state--</MenuItem>
              {countrydata.map((getstate, index) => (
                <MenuItem value={getstate.state_name} key={index}>
                  {getstate.state_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              select
              fullWidth
              label="City"
              name="city"
              variant="outlined"
              color={err === 7 ? "error" : ""}
              focused={err === 7 ? true : false}
              onChange={(e) => handlecity(e)}
            >
              <MenuItem value="">--Select city--</MenuItem>
              {city.map((getcity, index) => (
                <MenuItem value={getcity.city_name} key={index}>
                  {getcity.city_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
              fullWidth
              size="small"
              select
              label="Region"
              name="region"
              variant="outlined"
              color={err === 8 ? "error" : ""}
              focused={err === 8 ? true : false}
              value={region}
              onChange={storeChange}
            >
              <MenuItem value="EAST">EAST</MenuItem>
              <MenuItem value="WEST">WEST</MenuItem>
              <MenuItem value="SOUTH">SOUTH</MenuItem>
              <MenuItem value="NORTH">NORTH</MenuItem>
              <MenuItem value="SOUTH&EAST">SOUTH&EAST</MenuItem>
              <MenuItem value="NORTH&EAST">NORTH&EAST</MenuItem>
              <MenuItem value="SOUTH&WEST">SOUTH&WEST</MenuItem>
              <MenuItem value="NORTH&WEST">NORTH&WEST</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              fullWidth
              select
              label="Type"
              name="typee"
              variant="outlined"
              color={err === 9 ? "error" : ""}
              focused={err === 9 ? true : false}
              value={typee}
              onChange={storeChange}
            >
              <MenuItem value="L&B">L&B</MenuItem>
              <MenuItem value="NON-L&B">NON-L&B</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="status"
              name="statuss"
              variant="outlined"
              color={err === 10 ? "error" : ""}
              focused={err === 10 ? true : false}
              value={statuss}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Footage"
              name="footage"
              type="number"
              variant="outlined"
              color={err === 11 ? "error" : ""}
              focused={err === 11 ? true : false}
              value={footage}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">sq.m</InputAdornment>
                ),
              }}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Footage"
              name="footagee"
              type="number"
              variant="outlined"
              color={err === 12 ? "error" : ""}
              focused={err === 12 ? true : false}
              value={footagee}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">sq.ft</InputAdornment>
                ),
              }}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="active_status"
              name="active_status"
              variant="outlined"
              color={err === 13 ? "error" : ""}
              focused={err === 13 ? true : false}
              value={active_status}
              onChange={storeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker1" fullWidth
             name="tracker1" value={tracker1}
             onchange={(e)=>setTracker1(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker2" fullWidth
             name="tracker1" value={tracker2}
             onchange={(e)=>setTracker2(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker3" fullWidth
             name="tracker1" value={tracker3}
             onchange={(e)=>setTracker3(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker4" fullWidth
             name="tracker1" value={tracker4}
             onchange={(e)=>setTracker4(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker5" fullWidth
             name="tracker1" value={tracker5}
             onchange={(e)=>setTracker5(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker6" fullWidth
             name="tracker1" value={tracker6}
             onchange={(e)=>setTracker6(e.target.value)}/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker7" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker8" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker9" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker10" fullWidth/>
             </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
             size="small"
              variant="contained"
              onClick={() => navigate("/Dashboard/storeinfo")}
            >
              Back
            </Button>
            &nbsp;&nbsp;
            <Button  size="small"type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

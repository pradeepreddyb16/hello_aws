import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,FormControl,InputLabel,Select
} from "@mui/material";
import { SnackContext } from "../Context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import countrydata from "../../countrydata.json";
const axios = require("axios");

export function EditStore() {
  let { id } = useParams();
  const { snack, setSnack } = useContext(SnackContext);
  const navigate = useNavigate();
const[err,setErr]=useState();
  const [store, setStore] = useState({
    num: "",
    code: "",
    name: "",
    date: "",
    region: "",
    typee: "",
    statuss: "",
    footage: "",
    footagee: "",
    active_status:"",
  });
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState([]);
  const [cityName, setCityName] = useState("");
  const storeChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    getdata();
  }, []);
  const getdata = () => {
    const formdata = new FormData();
    formdata.append("id", id);
    console.log();
    axios.post("/api/get_single_store", formdata).then(function(res) {
      if (res.data.status === true) {
        console.log(res.data.data);
        const statename = res.data.data.store_state;
        const getCitydata = countrydata.find(
          (state) => state.state_name === statename
        ).cities;
        setCity(getCitydata);
        setStateName(statename);
       // setStateName(res.data.data.store_state);
        setCityName(res.data.data.store_city);
        setStore({
          num: res.data.data.store_no,
          code: res.data.data.store_code,
          name: res.data.data.store_name,
          date: res.data.data.opening_date,
          region: res.data.data.store_region,
          typee: res.data.data.store_type,
          statuss: res.data.data.store_status,
          footage: res.data.data.store_foot_m2,
          footagee: res.data.data.store_foot_ft2,
          active_status: res.data.data.active_status,
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
  const {
    num,
    code,
    name,
    date,
    region,
    typee,
    statuss,
    footage,
    footagee,
    active_status,
  } = store;
  const handlestate = (e) => {
    const statename = e.target.value;
    const getCitydata = countrydata.find(
      (state) => state.state_name === statename
    ).cities;
    setCity(getCitydata);
    setStateName(statename);
    console.log(statename);
    console.log(city);
  };
  const handlecity = (e) => {
    const cityname = e.target.value;
    console.log(cityname);
    setCityName(cityname);
  };
  const storeSubmit = async(e) => {
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
    } else if (name.length < 1) {
      setErr(3);
      setSnack({
        message: "Enter your store name",
        type: "error",
        open: true,
      });
    } else if (date.length < 1) {
      setErr(4);
      setSnack({
        message: "Enter your store opening date...",
        type: "error",
        open: true,
      });
    } else if (stateName.length < 1) {
      setErr(5);
      setSnack({
        message: "please select state...",
        type: "error",
        open: true,
      });
    } else if (cityName.length < 1) {
      setErr(6);
      setSnack({
        message: "Enter your city",
        type: "error",
        open: true,
      });
    } else if (region.length < 1) {
      setErr(7);
      setSnack({
        message: "please select region... ",
        type: "error",
        open: true,
      });
    } else if (typee.length < 1) {
      setErr(8);
      setSnack({
        message: "please select store type... ",
        type: "error",
        open: true,
      });
    } else if (statuss.length < 1) {
      setErr(9);
      setSnack({
        message: "please select status of store... ",
        type: "error",
        open: true,
      });
    } else if (footage.length < 1) {
      setErr(10);
      setSnack({
        message: "please select area in square meters... ",
        type: "error",
        open: true,
      });
    } else if (footagee.length < 1) {
      setErr(11);
      setSnack({
        message: "please select area in square feet... ",
        type: "error",
        open: true,
      });
    } else {
      console.log(cityName);
      const formdata = new FormData();
      formdata.append("store_id", id);
      formdata.append("store_no", num);
      formdata.append("code", code);
      formdata.append("name", name);
      formdata.append("open_date", date);
      formdata.append("city", cityName);
      formdata.append("state", stateName);
      formdata.append("region", region);
      formdata.append("type", typee);
      formdata.append("status", statuss);
      formdata.append("foot_m2", footage);
      formdata.append("foot_ft2", footagee);
      formdata.append("active_status", active_status);
      await axios.post("/api/update_store", formdata).then(function(res) {
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
        // backgroundColor: "#f2f2f2",
        my: 12,
        mx:25,
        px: 5,
        py: 1,
        width: "60%",
        boxShadow:5
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h4">Edit store details</Typography>
      </Grid>
      <br />
      <form onSubmit={storeSubmit}>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Id"
              name="id"
              variant="outlined"
              color={err===1?"erorr":""}
              focused={err===1?true:false}
              value={id}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store No."
              name="num"
              variant="outlined"
              color={err===2?"erorr":""}
              focused={err===2?true:false}
              value={num}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Code"
              name="code"
              variant="outlined"
              color={err===3?"erorr":""}
              focused={err===3?true:false}
              value={code}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Name"
              name="name"
              variant="outlined"
              color={err===4?"erorr":""}
              focused={err===4?true:false}
              value={name}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Store Opening Date"
              name="date"
              //type="date"
              variant="outlined"
              color={err===5?"erorr":""}
              focused={err===5?true:false}
              value={date}
              fullWidth
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
              color={err===6?"erorr":""}
              focused={err===6?true:false}
              value={stateName}
              select
              onChange={(e) => handlestate(e)}
            >
              <MenuItem value="">--Select state--</MenuItem>
              {countrydata.map((getstate, index) => (
                <MenuItem value={getstate.state_name} key={index}>
                  {getstate.state_name}
                </MenuItem>
              ))}</TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              select
              fullWidth
              label="City"
              name="city"
              color={err===7?"erorr":""}
              focused={err===7?true:false}
              value={cityName}
              variant="outlined"
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
             size="small"
              select
              label="Region"
              name="region"
              variant="outlined"
              color={err===8?"erorr":""}
              focused={err===8?true:false}
              value={region}
              fullWidth
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
            select
              label="Type"
              name="type"
              variant="outlined"
              color={err===9?"erorr":""}
              focused={err===9?true:false}
              value={typee}
              fullWidth
              onChange={storeChange}
            >
             <MenuItem value="L&B">L&B</MenuItem>
              <MenuItem value="NON-L&B">NON-L&B</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Status of Store"
              name="statuss"
              variant="outlined"
              color={err===10?"erorr":""}
              focused={err===10?true:false}
              value={statuss}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Footage M2"
              name="footage"
              variant="outlined"
              color={err===11?"erorr":""}
              focused={err===11?true:false}
              value={footage}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="Footage ft2 "
              name="footagee"
              variant="outlined"
              color={err===12?"erorr":""}
              focused={err===12?true:false}
              value={footagee}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small"
              label="active_status"
              name="active_status"
              variant="outlined"
              color={err===13?"erorr":""}
              focused={err===13?true:false}
              value={active_status}
              fullWidth
              onChange={storeChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker1" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker2" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker3" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker4" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker5" fullWidth/>
             </Grid>
             <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
             size="small" label="tracker6" fullWidth/>
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
              variant="contained"
              onClick={() => navigate("/Dashboard/storeinfo")}
            >
              Back
            </Button>
            &nbsp;&nbsp;
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

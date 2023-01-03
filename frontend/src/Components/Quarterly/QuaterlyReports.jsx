import {
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Grid,
  Box,
  TableBody,
  Button,
  Typography,
  TextField,Paper
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React,{useState,useEffect,useContext} from "react";
import { SnackContext, UserContext } from "../Context/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import {QuaterlyViewReport} from './QuaterlyViewReport';
import "react-data-table-component-extensions/dist/index.css";
const axios=require("axios");

export function QuaterlyReports() {
  const { snack, setSnack } = useContext(SnackContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate,setFromDate]=useState({})
  const [toDate,setToDate]=useState({})
  const navigate = useNavigate();
  useEffect(() => {
    getdata();
  }, []);

  const getdata = async() => {
    await axios.get("/api/quarterly_reports").then((res) => {
      if (res.data.status === true) {
        setData(res.data.data);
        setLoading(false);
        console.log(res.data.data);
       
      }
    });
  };
  return (
    <div>
      <Box sx={{ m: 12 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h4">Quarterly Reports</Typography>
          <TextField
            sx={{
              border: "4px solid",
              borderRadius: "8px",
              borderColor: "#d9d9d9",
              width: "20%",
            }}
            type="number"
            defaultValue="2022"
            variant="outlined"
          />
        </Grid>
        <Box sx={{ my: 5 }}>
          <TableContainer component={Paper}>
          <Table size="small">
              <TableHead sx={{ backgroundColor: "#2f7d32" }}>
                <TableRow>
                <TableCell>
                 <Typography sx={{color:"white"}}>  Quarter</Typography> 
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Service from</Typography> 
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> Service to</Typography> 
                  </TableCell>
                  <TableCell>
                    <Typography sx={{color:"white"}}> View Report</Typography> 
                  </TableCell>
                  {/* <TableCell>
                    <Typography sx={{color:"white"}}> Download Report</Typography> 
                  </TableCell> */}
                  {/* <TableCell>
                    <Typography sx={{color:"white"}}> Delete Report</Typography> 
                  </TableCell> */}
                </TableRow>
              </TableHead>
              {loading ? (
                <></>
              ) : (
                data.map((data) => (
                <TableBody  >
                    <TableRow>
                       <TableCell >
                    { data. quarter}
                    
                      </TableCell> 
                      <TableCell >
                      {data.service_from}
                      </TableCell>
                      <TableCell >
                      {data.service_to}
                      </TableCell>
                      <TableCell >
                      <Button
                          variant="contained"
                          color="warning"
                          onClick={()=>{  
                            localStorage.setItem("from",data.service_fromm)
                            localStorage.setItem("to",data.service_too)                         
                            navigate("/Dashboard/quaterlyviewreport")}}
                        >
                          View
                        </Button>
                      </TableCell>
                      {/* <TableCell >
                        <Button
                          variant="contained"
                          color="info"
                          //onClick={deleteReport}
                        >
                          Download
                        </Button>
                      </TableCell>
                      <TableCell >
                        <Button
                          variant="contained"
                          color="error"
                          //  onClick={downloadReport}
                        >
                          Delete
                        </Button>
                      </TableCell> */}
                      </TableRow>
                  </TableBody>
                )))}
            </Table>
          </TableContainer>
         
        </Box>
        {/* {loading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="h4">Please wait......</Typography>
          </div>
        )} */}
      </Box>
      {/* <QuaterlyViewReport fromDate={fromDate} toDate={toDate} hidden/> */}
    </div>
  );
}

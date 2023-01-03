import {
  Typography,
  Box,
  DialogContent,
  DialogContentText,
  DialogActions,Button,TextField,Grid,Dialog
} from "@mui/material";
import React,{useState,useContext,useEffect} from "react";
import { UserContext,SnackContext } from "../Context/UserContext";
const axios = require("axios");

export function UrjanetSupport() {
  const [open,setOpen] = useState(false);
  const { snack, setSnack } = useContext(SnackContext);
  const [data,setData] = useState({});
  const { userProfile, setUserProfile } = useContext(UserContext);
  const [contact, setContact] = useState({
    ticket_1: "",
    email_1: "",
    ticker_2: "",
    email_2: "",
    email_3: "",
  });
   useEffect(()=>{
    getdata();
  },[])
  const getdata=async()=>{
    await axios.get("/api/view_contact").then((res) => {
      console.log("hiiiiiii");
      if (res.data.status === true) {
        console.log("hi");
        console.log(res.data.data[0]);
        setData(res.data.data[0]);
        console.log(data);
        setContact({
          ticket_1:res.data.data[0].zendesk_support,
          email_1:res.data.data[0].arcadia_poc,
          ticker_2:res.data.data[0].standard_support,
          email_2:res.data.data[0].mail2,
          email_3:res.data.data[0].mail3
         })
  }else{
    console.log("no");
  }
  console.log(data);
  });
   console.log(data);
   console.log(contact.ticker_2)
}
  const contactChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };
  const contactSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("ticket1", contact.ticket_1);
    formdata.append("mail1", contact.email_1);
    formdata.append("ticket2", contact.ticker_2);
    formdata.append("mail2", contact.email_2);
    formdata.append("mail3", contact.email_3);
    await axios.post("/api/contact_us", formdata).then(function(res) {
      if (res.data.status === true) {
        setSnack({
          message: res.data.msg,
          color: "green",
          type: "success",
          open: true,
        });
        setOpen(false);
        getdata();
      } else {
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
    <div>
      <Box sx={{ m: 20 }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
           <Typography align="left">
          1.Zendesk support : {data.zendesk_support}
        </Typography>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {userProfile.admin_role === 1 && (
          <Button size="small" type="submit" variant="contained" 
          onClick={()=>setOpen(true)}>
            edit
          </Button>
        )}
        </Grid>
                <Typography align="left">
          2.Arcadia POC : {data.arcadia_poc}
        </Typography>
        <Typography align="left">3.Escalation:(From contract)</Typography>
        <Typography align="left" sx={{ textIndent: "3em" }}>
          a.Standard Support-{data.standard_support}
        </Typography>
        <Typography align="left" sx={{ textIndent: "3em" }}>
          b.Manager,Customer Success,Sonny Chabdra Kumaran
          ({data.mail2})
        </Typography>
        <Typography align="left" sx={{ textIndent: "3em" }}>
          c.Associate Director,Customer Support,Mrinal Saurav
          ({data.mail3
})
        </Typography>
      </Box>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            <Box sx={{height:"450px",width:"250px" }}>
              <form onSubmit={contactSubmit}>
                <TextField
                fullwidth
                 size="small"
                  name="ticket_1"
                  label="  ticket_1"
                  value={contact.ticket_1}
                  type="text"
                  sx={{ m: 2 }}
                  onChange={contactChange}
                />
                <TextField
                fullwidth
                 size="small"
                  name="email_1"
                  label="email_1"
                  value={contact.email_1}
                  type="text"
                  sx={{ m: 2 }}
                  onChange={contactChange}
                />
                <TextField
                fullwidth
                 size="small"
                  name="ticker_2"
                  label="ticker_2"
                  value={contact.ticker_2}
                  type="text"
                  sx={{ m: 2 }}
                  onChange={contactChange}
                />
                <TextField
                fullwidth
                 size="small"
                  name="email_2"
                  label="email_2"
                  value={contact.email_2}
                  type="text"
                  sx={{ m: 2 }}
                  onChange={contactChange}
                />
                <TextField
                fullwidth
                 size="small"
                  name="email_3"
                  label="email_3"
                  value={contact.email_3}
                  type="text"
                  sx={{ m: 2 }}
                  onChange={contactChange}
                />
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  sx={{ m: 2 }}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

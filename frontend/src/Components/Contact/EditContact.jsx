import { TextField } from "@mui/material";
import axios from "axios";
import React from "react";
 export const EditContact=()=>{
    const [contact,setContact] = useState({
        ticket_1:"",
        email_1:"",
        ticker_2:"",
        email_2:"",
        email_3:""
    })
    const contactChange=(e)=>{
        setContact({
            ...contact,[e.target.name]:e.target.value
        })
    }
    const contactSubmit=async(e)=>{
        e.preventDefault();
        const formdata=new FormData();
        formdata.append("ticket1",contact.ticket_1);
        formdata.append("mail1",contact.email_1);
        formdata.append("ticket2",contact.ticker_2);
        formdata.append("mail2",contact.email_2);
        formdata.append("mail3",);
        await axios.post("/api/contact_us",formdata).then(function(res){
            if (res.data.status === true) {
                // setOpen(false);
                 setSnack({
                   message: res.data.msg,
                   color: "green",
                   type: "success",
                   open: true,
                 });
                 setOpen(true);
               } else {               
                 setSnack({
                   message: res.data.msg,
                   color: "error",
                   type: "error",
                   open: true,
                 });
               }
        })
    }
    return(
        <Box sx={{p:2}}>
            <form onSubmit={contactSubmit}>
            <TextField
            name="ticket_1"
            label="  ticket_1"
            value={contact.ticket_1}
            type="text"
            sx={{m:2}}
            onChange={contactChange}/>
             <TextField
            name="email_1"
            label="email_1"
            value={contact.email_1}
            type="text"
            sx={{m:2}}
            onChange={contactChange}/>
             <TextField
            name="ticker_2"
            label="ticker_2"
            value={contact.ticker_2}
            type="text"
            sx={{m:2}}
            onChange={contactChange}/>
             <TextField
            name="email_2"
            label="email_2"
            value={contact.email_2}
            type="text"
            sx={{m:2}}
            onChange={contactChange}/>
             <TextField
            name="email_3"
            label="email_3"
            value={contact.email_3}
            type="text"
            sx={{m:2}}
            onChange={contactChange}/>
            <Button  size="small"type="submit" variant="contained"sx={{m:2}}>
              Submit
            </Button>
        </form>
        </Box>
    )
 }
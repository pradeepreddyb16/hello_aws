import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Grid,
  ListItemText,
  ListItemButton,
  List,
  Box,Typography
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import EmailIcon from "@mui/icons-material/Email";
import StoreIcon from "@mui/icons-material/Store";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { useNavigate } from "react-router-dom";
const drawerWidth = 220;

export function LeftDrawer() {
  const [color, setColor] = useState();
  const navigate = useNavigate();
  const reportList = [
    {
      id: "1",
      linkName: "yearlyreports",
      icon: <SummarizeIcon />,
      report: "Yearly reports",
    },
    {
      id: "2",
      linkName: "quaterlyreports",
      icon: <SummarizeIcon />,
      report: "Quarterly reports",
    },
    {
      id: "3",
      linkName: "monthlyreports",
      icon: <SummarizeIcon />,
      report: "Monthly reports",
    },
    { id: "4", linkName: "followup", icon: <FollowTheSignsIcon />, report: "Follow-up" },
    {
      id: "5",
      linkName: "storeinfo",
      icon: <StoreIcon />,
      report: "Store Info",
    },
    {
      id: "6",
      linkName: "urjanetsupport",
      icon: <EmailIcon />,
      report: "Contact Us",
    },
    { id: "7", linkName: "users", icon: <PeopleIcon />, report: "Users" },
  ];
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRadius: 4,
          boxShadow: 3,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box>
        <List>
          {reportList.map((obj) => (
            <div>
              <ListItemButton
                sx={{ height: "50px" }}
                style={{
                  backgroundColor: color === obj.id ? "#2f7d32" : "",
                }}
                onClick={() => {
                  setColor(obj.id);
                  navigate(`/Dashboard/${obj.linkName}`);
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: color===obj.id ? "white":"#004037",
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-end"
                  >
                    {obj.icon}&nbsp;&nbsp;
                    <Typography>{obj.report}</Typography>
                  </Grid>
                </ListItemText>
              </ListItemButton>
              {/* <Divider color="#004037" /> */}
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

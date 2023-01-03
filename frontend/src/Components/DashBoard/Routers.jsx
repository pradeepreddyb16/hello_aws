import React, { useState, useContext }  from "react";
import { YearlyReports } from "../Yearly/YearlyReports";
import { MonthlyReports } from "../Monthly/MonthlyReports";
import { QuaterlyReports } from "../Quarterly/QuaterlyReports";
import { FollowUp } from "../StoreFollowUp/FollowUp";
import { FollowUp2 } from "../StoreFollowUp/FollowUp2";
import { FollowUp1 } from "../StoreFollowUp/FollowUp1";
//import { EditFollowUp } from "../StoreFollowUp/EditFollowUp";
import { ContactUs } from "../ContactUs";
import { UrjanetSupport } from "../Contact/UrjanetSupport";
import {  Routes, Route, Navigate } from "react-router-dom";
import { AddStore } from "../Store/AddStore";
import { AddUser } from "../Users/AddUser";
import { EditUser } from "../Users/EditUser";
import { EditStore } from "../Store/EditStore";
import { Users } from "../Users/Users";
import { ForgotPwd }from "../ForgotPassword/ForgotPwd"
import { StoreInfo } from "../Store/StoreInfo";
import { MonthlyViewReport } from "../Monthly/MonthlyViewReport";
import { QuaterlyViewReport } from "../Quarterly/QuaterlyViewReport";
import { YearlyViewReports } from "../Yearly/YearlyViewReports";
import { SnackContext, UserContext } from "../Context/UserContext";

export function Routers(){
    const { userProfile, setUserProfile } = useContext(UserContext);
    return(
        <Routes>
        <Route
          path="yearlyreports"
          element={userProfile ? <YearlyReports /> : <Navigate to="/" />}
        />
        <Route
          path="yearlyviewreports"
          element={userProfile ? <YearlyViewReports /> : <Navigate to="/" />}
        />
        <Route
          path="quaterlyreports"
          element={userProfile ? <QuaterlyReports /> : <Navigate to="/" />}
        />
        <Route
          path="monthlyreports"
          element={userProfile ? <MonthlyReports /> : <Navigate to="/" />}
        />
        <Route
          path="followup"
          element={userProfile ? <FollowUp2 /> : <Navigate to="/" />}
        />
        {/* <Route
          path="editfollowup"
          element={userProfile ? <EditFollowUp /> : <Navigate to="/" />}
        /> */}
        <Route
          path="monthlyviewreport"
          element={userProfile ? <MonthlyViewReport /> : <Navigate to="/" />}
        />
        <Route
          path="quaterlyviewreport"
          element={userProfile ? <QuaterlyViewReport /> : <Navigate to="/" />}
        />
        <Route
          path="contactus"
          element={userProfile ? <ContactUs /> : <Navigate to="/" />}
        />
        {/* <Route
          path="forgotpwd"
          element={ < ForgotPwd  /> }
        /> */}
        <Route
          path="urjanetsupport"
          element={userProfile ? <UrjanetSupport /> : <Navigate to="/" />}
        />
        <Route
          path="addstore"
          element={userProfile ? <AddStore /> : <Navigate to="/" />}
        />
        <Route
          path="editstore/:id"
          element={
            userProfile &&
            (userProfile.admin_role === 1 || userProfile.admin_role === 3) ? (
              <EditStore />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="adduser"
          element={
            userProfile && userProfile.admin_role === 1 ? (
              <AddUser />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="edituser/:id"
          element={
            userProfile && userProfile.admin_role === 1 ? (
              <EditUser />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="users"
          element={
            userProfile && userProfile.admin_role === 1 ? (
              <Users />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="storeinfo"
          element={
            userProfile && userProfile.admin_role === 1 ? (
              <StoreInfo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    )
}
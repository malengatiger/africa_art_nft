import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import { IDashboardProps } from "./Dashboard";
import { useEffect, useState } from "react";

export default function DashboardAppBar(props: IDashboardProps) {
  console.log(`🦠 DashboardAppBar: starting at ${new Date().toISOString()}`);
  console.log(props.user);
  const { logout, account } = useMoralis();

  async function onLogout() {
    console.log(
      `🦠 DashboardAppBar: Logging Out at ${new Date().toISOString()}`
    );
    console.log(props.user);
    await logout();
    await saveLogout();
    console.log(
      `🦠 🦠 DashboardAppBar: Logged Out at ${new Date().toISOString()}`
    );
  }

  async function saveLogout() {
    console.log(
      `🥦 🥦 🥦 DashboardAppBar: Saving LogoutRecord for User account: ${account} 🥦 🥦 🥦 `
    );
    const SignOutRecord = Moralis.Object.extend("SignOutRecord");
    const logoutRecord = new SignOutRecord();

    logoutRecord.set("ethAddress", JSON.stringify(account));

    logoutRecord.save().then(
      (logoutRecord: { id: string }) => {
        console.log(
          "🥦 🥦 🥦  SignOutRecord written, objectId: 🥦 " + logoutRecord.id
        );
      },
      (error: { message: string }) => {
        console.log(
          "🔴 🔴 🔴 Failed to create SignOutRecord, with error code: " +
            error.message
        );
      }
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Africa Art Marketplace
          </Typography>
          <Button variant="contained" color="secondary" onClick={onLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import web3StatusType from "web3";
import { Logout } from "@mui/icons-material";
import { useMetaMask } from "metamask-react";
import Moralis from "moralis";
import { Alert, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashboard from "./Dashboard";
import Web3 from 'web3';
export interface ILandingPageProps {}

export default function LandingPage(props: ILandingPageProps) {
  const {
    account,
    isAuthenticated,
    logout,
    login,
    deactivateWeb3,
    enableWeb3,
    isWeb3Enabled,
    isInitialized,
    isWeb3EnableLoading,
    isAuthenticating,
    authenticate,
    authError,
    Moralis,
  } = useMoralis();
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  const { status, connect, chainId, ethereum } = useMetaMask();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [web3Status, setWeb3Status] = useState<web3StatusType>();
  const [user, setUser] = useState<Moralis.User>();
  const [ip, setIP] = useState("");
  //ipgeolocation api key: 80429a5ddbf34a0d94f41b1ce510c802
  checkWallet();
  async function checkWallet() {
    if (status === "initializing")
      console.log("🌍 🌍 🌍 🌍 Synchronisation with MetaMask ongoing...");

    if (status === "unavailable") {
      console.log("🌍 🌍 MetaMask not available...");
      return <div>MetaMask not available :(</div>;
    }

    if (status === "notConnected") {
      console.log("🌍 🌍 🌍 🌍  MetaMask not connected...");
    }

    if (status === "connecting") {
      console.log("🌍 🌍 🌍 🌍  MetaMask connecting...");
    }

    if (status === "connected") {
      console.log("🌍 🌍 🌍 🌍 🌿 🌿 🌿 MetaMask is connected 🌍 🌍 🌍 🌍 ");
      console.log(`🌍 🌍 🌍 🌍 chainId: ${chainId}`);
    }

    
    //
    try {
      // Request account access
      const web3 = new Web3(ethereum);
      const accts = await web3.eth.getAccounts();
      console.log(accts);
      
      let version = await Web3.version;
      console.log(`Web3 version: ${version}`);
     
      console.log(web3);
      console.log(web3.eth.accounts);
      //
       const bal = await web3.eth.getBalance(
         "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
       );
       console.log(`🍔 🍔 🍔 Balance: ${bal} 🍔 `);
    } catch (e) {
      console.log(e);
    }
   
  }

  function print() {
    console.log(`\n\n🔱🔱 `);
    console.log(`🔱🔱 MetaMask status: ${status}`);
    console.log(`🔱🔱 isInitialized: ${isInitialized}`);
    console.log(`🔱🔱 isWeb3Enabled: ${isWeb3Enabled}`);
    console.log(`🔱🔱 isAuthenticated: ${isAuthenticated}`);
    console.log(`🔱🔱 web3Status: ${web3Status}`);
    console.log(`🔱🔱 account: ${account}`);
    console.log(`🔱🔱 chainId: ${chainId}`);
    console.log(`🔱🔱 \n\n`);
  }
  useEffect(() => {
    console.log(
      `\n🍎 LandingPage 👽👽👽👽 useEffect starting; doing nuthin so far`
    );
    print()
  });

  async function onSignInClicked() {
    console.log("🍏 🍏 🍏 🍏  .... call Moralis.authenticate() ....");
    print();
    let result = await authenticate({
      signingMessage: "Africa Art authenticating ...",
    }).catch(function (error) {
      console.log(`We have an authenticate ERROR`);
      console.log(error);
    });
    console.log(result);
    if (result) {
      console.log("🍎 🍎 🍎 MetaMask logged in user:", JSON.stringify(result));
      console.log(`🍎 🍎 🍎 Address: ${result.get("ethAddress")} `);
      saveLogin(result);
    }
    print();
  }
  async function saveLogin(user: Moralis.User) {
    console.log(
      `🥦 🥦 🥦 Saving SignInRecord for current User; ethAddress: ${user.get(
        "ethAddress"
      )} 🥦 🥦 🥦 `
    );
    const SignInRecord = Moralis.Object.extend("SignInRecord");
    const loginRecord = new SignInRecord();

    loginRecord.set("ethAddress", user.attributes.ethAddress);
    loginRecord.set("wallet", "MetaMask");

    loginRecord.save().then(
      (loginRecord: { id: string }) => {
        // Execute any logic that should take place after the object is saved.
        console.log(
          "🥦 🥦 🥦  SignInRecord written to DB, objectId: 🥦 " + loginRecord.id
        );
      },
      (error: { message: string }) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        console.log(
          "🔴 🔴 🔴 Failed to create SignInRecord, with error message!: " +
            error.message
        );
      }
    );
  }

  // let mUser: Moralis.User;
  if (isAuthenticated) {
    console.log(` 🍐  🍐  🍐  🍐 user already Authenticated`);
    const mUser = Moralis.User.current() as Moralis.User;
    console.log(mUser);
    console.log(`🍐  🍐  🍐  🍐 ethAddress: ${mUser.attributes.ethAddress}`);
    console.log(`🍐  🍐  🍐  🍐 accounts: ${mUser.attributes.accounts}`);
    console.log(`🍐  🍐  🍐  🍐 createdAt: ${mUser.createdAt}`);
    return <Dashboard user={mUser} />;
  } else {
    return (
      <>
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
              <Typography>Some info here</Typography>
            </Toolbar>
          </AppBar>
        </Box>

        <Box sx={{ justifyContent: "center", align: "center", margin: 24 }}>
          <Paper variant="outlined" sx={{ padding: 4, bgColor: "red" }}>
            <Typography>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Typography>
          </Paper>
          <Box sx={{ margin: 2, padding: 4 }}>
            <Typography>Sign in with MetaMask</Typography>
            <Button variant="contained" onClick={onSignInClicked}>
              Sign In
            </Button>
          </Box>
        </Box>
      </>
    );
  }
}

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MetaMaskProvider } from "metamask-react";
import { purple, teal } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MoralisProvider } from "react-moralis";

const customTheme = createTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: purple[300],
    },
  },
});

console.log(`index.js; 🈂️  🈂️  🈂️ africa_art_nft app starting .............`);
const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
const isServerInfo = APP_ID && SERVER_URL ? true : false;
//Validate
if (!APP_ID || !SERVER_URL)
  throw new Error(
    "🔥 🔥 🔥 🔥 Missing Moralis Application ID or Server URL. 🔵 Make sure to set your .env file."
  );

console.log(`Application: 🌀🌀🌀 Moralis APP_ID: ${APP_ID}`);
console.log(`Application: 🌀🌀🌀 Moralis SERVER_URL: ${SERVER_URL}`);
console.log(`Application: 🌀🌀🌀 isServerInfo: ${isServerInfo}`);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <MetaMaskProvider>
          <App />
        </MetaMaskProvider>
      </MoralisProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

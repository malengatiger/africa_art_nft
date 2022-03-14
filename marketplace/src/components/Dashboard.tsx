import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import Moralis from "moralis";
import { useState, useEffect } from "react";
import { useMoralis, useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
import DashboardAppBar from "../components/DashboardAppBar";
import Upload from "./Upload";

const Dashboard = (props: IDashboardProps) => {
  console.log(`Dashboard starting with Moralis User`);
  console.log(props.user);
  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const { account } = useMoralis();

  //   const { data, error, isLoading } = useMoralisQuery(
  //     "Log",
  //     (query) => query.equalTo("owner", String(account)),
  //     [],
  //     { live: true }
  //   );

  useEffect(() => {
    console.log(`\n🐳 🐳  Dashboard: 👽👽👽👽 useEffect starting ...`);
    getData();
  }, [tokenBalance]);

  const getData = async () => {
    await Moralis.enableWeb3();
    await getEthBalance();
    await getTransactions();
    await getEthTokenBalance();
    console.log(`🐳 🐳 Dashboard: 👽👽👽👽 completed getting Moralis DB data ...`);
  };
  const checkWallet = async () => {

  }
  async function getEthBalance() {
    console.log(
      `🍎 Getting ethBalance from Moralis : address: ${props.user.get(
        "ethAddress"
      )}`
    );
    const Bal = Moralis.Object.extend("EthBalance");
    const query = new Moralis.Query(Bal);
    query.equalTo("address", props.user.get("ethAddress"));
    const results = await query.find();
    console.log(
      ` 🛎 🛎  🛎 EthBalance Successfully retrieved: 🛎 ${results.length} balances 🛎 `
    );
    if (results.length === 1) {
      let x = results[0];
      console.log(
        `🛎 🛎 🛎 🛎 ETHEREUM BALANCE: ${x.get("balance")} for account ${x.get(
          "address"
        )} 🛎 🛎`
      );
      setBalance(x.get("balance"));
    }
  }
  async function getEthTokenBalance() {
    console.log(
      `🍎 Getting ethTokenBalance from Moralis : address: ${props.user.get(
        "ethAddress"
      )}`
    );
    const Bal = Moralis.Object.extend("EthTokenBalance");
    const query = new Moralis.Query(Bal);
    // query.equalTo("address", props.user.get("ethAddress"));
    const results = await query.find();
    console.log(
      ` 🛎 🛎  🛎 EthTokenBalance Successfully retrieved: 🛎 ${results.length} balances 🛎 `
    );
    results.forEach(function (bal: any) {
      console.log(bal);
    });
  }

  async function getTransactions() {
    console.log(
      `\n\n🍎 getTransactions: Get transactions from Moralis : ${props.user.get(
        "ethAddress"
      )}`
    );

    const mTransactions = await Moralis.Cloud.run("transactions", {
      from_address_string: props.user.get("ethAddress"),
    });
    setTransactions(mTransactions);
    console.log(mTransactions);
    console.log(
      `🥦 🥦 🥦  readCloudFunctions: Get transactions:  from Moralis:  
      🥬 ${mTransactions.length} transactions  🥬\n\n`
    );

    let totalValue: number = 0;

    //calculate total value of transactions
    mTransactions.forEach(function (tran: any) {
      const val: number = parseInt(tran.get("value"));
      const m = val / divisor;
      totalValue += m;
    });
    setTotalValue(totalValue);
    console.log(`🍀 🍀 🍀 Total Value of Transactions made: 🍀 ${totalValue}`);
  }
  //temporary: divisor for wei to eth
  const divisor = 1000000000000000000;

  return (
    <>
      <DashboardAppBar user={props.user} />
      <Box sx={{ margin: 4 }}>
        <Typography sx={{ color: "grey" }}>Ethereum Address</Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          {props.user.attributes.ethAddress}
        </Typography>
      </Box>
      <Box sx={{ bgcolor: "grey" }}>
        <Grid container spacing={4} sx={{ margin: 8 }}>
          <Grid item>
            <Card sx={{ minWidth: 300, minHeight: 300 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 24, fontWeight: "bold" }}
                  color="text.secondary"
                  gutterBottom
                >
                  User Identification
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.primary">
                  {props.user.id}
                </Typography>
                <Typography variant="h5" component="div">
                  Balance
                </Typography>

                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {(balance / divisor).toFixed(4)} ETH
                </Typography>
              </CardContent>
              <CardActions>
                <Box sx={{ marginBottom: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={getData}
                  >
                    Refresh Balance
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>

          <Grid item>
            <Card sx={{ minWidth: 300, minHeight: 300 }}>
              <CardContent>
                <Box>
                  <Typography variant="h6" component="div">
                    Total Transactions
                  </Typography>

                  <Typography
                    variant="h2"
                    sx={{ fontWeight: "bold", fontSize: 24, color: "red" }}
                  >
                    {transactions.length}
                  </Typography>
                </Box>
                <Typography sx={{ marginTop: 2 }} variant="h6" component="div">
                  Total Transaction Value
                </Typography>
                <Box sx={{ color: "blue", fontWeight: "bold" }}>
                  <Typography variant="h4">
                    {totalValue.toFixed(2)} ETH
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Box sx={{ marginBottom: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={getData}
                  >
                    Refresh Transactions
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
         
        </Grid>
      </Box>
      <Upload />
    </>
  );
};

export interface IDashboardProps {
  user: Moralis.User;
}

export default Dashboard;

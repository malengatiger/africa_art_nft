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
import { NativeBalance } from "web3uikit";
import { StepNumberProps } from "web3uikit/dist/components/Stepper/types";
import DashboardAppBar from "../components/DashboardAppBar";

const Dashboard = (props: IDashboardProps) => {
  console.log(`Dashboard starting with Moralis User`);
  console.log(props.user);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const { account } = useMoralis();
  //   const { data, error, isLoading } = useMoralisQuery(
  //     "Log",
  //     (query) => query.equalTo("owner", String(account)),
  //     [],
  //     { live: true }
  //   );

  useEffect(() => {
    console.log(`\n🐳 🐳  Dashboard: 👽👽👽👽 useEffect starting...`);
    getData();
  }, []);

  const getData = async () => {
    await getEthBalance();
    await getTransactions();
    console.log(`🐳 🐳 Dashboard: 👽👽👽👽 done getting DB data ...`);
  };
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
  async function getTransactions() {
    console.log(
      `\n\n🍎 getTransactions: Get transactions from Moralis : ${props.user.get(
        "ethAddress"
      )}`
    );

    const mTransactions = await Moralis.Cloud.run("transactions", {
      from_address_string: props.user.get("ethAddress"),
    });
    // const transactions = await Moralis.Cloud.run("transactions");
    setTransactions(mTransactions);
    console.log(mTransactions);
    console.log(
      `🥦 🥦 🥦  readCloudFunctions: Get transactions:  from Moralis:  
      🥬 ${mTransactions.length} transactions  🥬\n\n`
    );

    let totalValue: number = 0;

    mTransactions.forEach(function (tran: any) {
      //   console.log(
      //     `ID: ${tran.id} FROM: ${tran.attributes.from_address} \nTO: ${tran.attributes.to_address} \nVALUE: ${tran.attributes.value}`
      //   );
      const val: number = parseInt(tran.get("value"));

      //   const eth = Moralis.Units.FromWei(tran.get('value'), 2) as unknown as number;
      const m = val / 1000000000000000000;
      console.log(m);
      totalValue += m;
    });

    //const tokenValue = Moralis.Units.FromWei(totalValue, 2);
    console.log(`🍀 🍀 🍀 Total Value of Transactions: 🍀 ${totalValue}`);
    // for (const x in transactions) {
    //     // console.log(`from_address: ${x.get("from_address")}`);
    //     // console.log(`to_address: ${x.get("to_address")}`);
    //     //console.log(x)
    // }
  }

  return (
    <>
      <DashboardAppBar user={props.user} />
      <Box sx={{ margin: 4 }}>
        <Typography sx={{ fontWeight: "bold" }}>Address</Typography>
        <Typography> {props.user.attributes.ethAddress}</Typography>
      </Box>
      <Grid container spacing={4} sx={{ margin: 8 }}>
        <Grid item>
          <Card sx={{ minWidth: 275 }}>
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

              <Typography
                variant="h2"
                sx={{ fontWeight: "bold", fontSize: 20 }}
              >
                {balance} ETH
              </Typography>
              <Box sx={{ marginTop: 4, flexDirection: "row" }}>
                <Typography variant="h6" component="div">
                  Transactions
                </Typography>

                <Typography
                  variant="h2"
                  sx={{ fontWeight: "bold", fontSize: 24, color: "red" }}
                >
                  {transactions.length}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                size="medium"
                onClick={getData}
              >
                Transactions
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item>2</Grid>
        <Grid item>3</Grid>
      </Grid>
    </>
  );
};

export interface IDashboardProps {
  user: Moralis.User;
}

export default Dashboard;

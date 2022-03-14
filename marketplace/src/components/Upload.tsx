import React, { useState } from "react";
import Moralis from "moralis";
import ArtNFT from "../contracts/ArtNFT.json";
import NFTMarket from "../contracts/NFTMarket.json";
import { useWeb3ExecuteFunction, useApiContract } from "react-moralis";
import {
  Button,
  TextField,
  Input,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { BigNumber } from "ethers";

const Upload = () => {
  const abi: any = ArtNFT.abi;
  const [mTokenUri, setTokenUri] = useState<string>();
  // const { runContractFunction, data, error, isLoading, isFetching } =
  //   useApiContract({
  //     functionName: "createToken",
  //     address: "0xB6BF18B4B601A7f92e1bcd785F942Ee82D137954",
  //     abi: [
  //       {
  //         inputs: [
  //           {
  //             internalType: "string",
  //             name: "tokenUri",
  //             type: "string",
  //           },
  //         ],
  //         name: "createToken",
  //         outputs: [
  //           {
  //             internalType: "uint256",
  //             name: "",
  //             type: "uint256",
  //           },
  //         ],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //     ],
  //     params: {'tokenUri': mTokenUri},
  //   });
  
  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "tokenUri",
            type: "string",
          },
        ],
        name: "createToken",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    contractAddress: "0xB6BF18B4B601A7f92e1bcd785F942Ee82D137954",
    functionName: "createToken",
    params: { tokenUri: mTokenUri },
  });

  async function mintTokenLegacy() {
    console.log(
      `\n\n\n🔵 🔵 🔵 🔵 🔵 mint NF Token Legacy : talk to the ArtNFT contract`
    );
    console.log(`tokenUri: ${mTokenUri}`)
    let options = {
      contractAddress: "",
      functionName: "createToken",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenUri",
              type: "string",
            },
          ],
          name: "createToken",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: { 'tokenUri': mTokenUri },
      msgValue: Moralis.Units.ETH(0.0),
    };
    console.log(`contract options: ${JSON.stringify(options)}`)
    let result = await Moralis.executeFunction(options);
    console.log(result);
  }

  async function mintToken(_uri: any) {
    console.log(`🔵 🔵 🔵 🔵 🔵 mint NF Token: talk to the ArtNFT contract`);
    console.log(`🔆  🔆 tokenURI: ${_uri}`);
    const user = Moralis.User.current();
    console.log(user);

    console.log(`🔵 🔵 🔵 🔵 🔵 mint NFT Token: fetch with abi below ...`);
    console.log(abi);
    console.log(`🌀🌀🌀 mTokenUri: ${mTokenUri}`);


    let result: any = await fetch().catch((e) => {
      console.log(`🔴 🔴 🔴 Error from fetch catch ....`);
      console.log(e);
    });
    // let result = await runContractFunction()
    console.log(`🔵 🔵 🔵 🔵 🔵 result from contract call ...`);
    if (result) {
      console.log(result);
    } else {
      console.log("🎈 Contract call returned 🎈 null | undefined 🎈");
    }

    if (error)
    console.log(`🔴 🔴 🔴 🔴 error from contract call ... ${JSON.stringify(error)}`);
    
    if (data) {
      console.log(`🔵 🔵 🔵 🔵 🔵 data from contract call ...`);
      console.log(data);
    }
  }
  //function_name: "mintToken"
  // address: "0x4cA68C56b5a53704913547D4691A1844c6f9f9f3",

  //0x570e0f06c721d21513CbC817Cf8020f67deBE5EB

  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<Moralis.File>();

  const onNameChange = (e: any) => {
    setName(e.target.value);
    console.log(e.target.value);
  };

  const onFileChange = (event: any) => {
    console.log(`onFileChange: 🍎 🍎 🍎 ${event.target.value}`);
    // this.setState({ selectedFile: event.target.files[0] });
    console.log(event);
    console.log(event.target.files[0]);
    const file: File = event.target.files[0];
    console.log(`🌸 File name is ${file.name} size: ${file.size}`);
    console.log(`🌸 File type: ${file.type}`);

    const imageFile = new Moralis.File(file.name, file);
    setSelectedFile(imageFile);
    console.log(imageFile);
  };
  const onDescChange = (event: any) => {
    console.log(event.target.value);
    setDesc(event.target.value);
  };

  async function saveToIPFS() {
    console.log(
      `🔵 🔵 🔵 🔵 🔵 .... saving to IPFS, selectedFile: ${selectedFile?.name()}`
    );
    if (selectedFile) {
      const ipfsFile = await selectedFile.saveIPFS();
      console.log(ipfsFile);
      const uri = ipfsFile.url();
      const metadata = {
        name: name,
        description: desc,
        image: uri,
      };
      console.log(
        `🔵 🔵 🔵 🔵 🔵 .... saving to IPFS, metadata: ${JSON.stringify(
          metadata
        )}`
      );
      console.log('creating Moralis file ...')
      const metadataFile = new Moralis.File("metadata.json", {
        base64: Buffer.from(JSON.stringify(metadata), "base64").toString(),
      });
      console.log(metadataFile);

      let file: Moralis.File = await metadataFile.saveIPFS();

      console.log(
        `🚸 🚸 🚸 .. File saved to IPFS; 🚸 url: ${file.url()} ... setting state`
      );
      const metadataURI = file.url();
      setTokenUri(metadataURI);
    }
  }

  return (
    <Box sx={{ paddingLeft: 8 }}>
      <Paper>
        <Typography variant="h3" sx={{ fontWeight: "bold", marginLeft: 4 }}>
          Mint NFT
        </Typography>

        <TextField
          sx={{ fontWeight: "bold", marginLeft: 4, marginTop: 2 }}
          onChange={onNameChange}
          value={name}
          fullWidth={true}
          label={"Name of the NFT"} //optional
        />
        <TextField
          fullWidth={true}
          sx={{ fontWeight: "bold", marginLeft: 4 }}
          onChange={onDescChange}
          value={desc}
          label={"Description"} //optional
        />

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginLeft: 4, marginTop: 2 }}
        >
          Upload NFT File
        </Typography>
        <Box
          sx={{
            fontWeight: "bold",
            marginLeft: 4,
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <Input
            type="file"
            onChange={onFileChange}
            placeholder="NFT File"
            sx={{
              fontSize: 20,
              marginBottom: 2,
            }}
          />
        </Box>
        <Box sx={{ marginLeft: 2, marginBottom: 28 }}>
          <Button variant="contained" onClick={saveToIPFS}>
            Upload to IPFS
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              mintToken(mTokenUri);
            }}
          >
            Mint Token
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Upload;

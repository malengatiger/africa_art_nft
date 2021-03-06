const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("πππ Greeter", function () {
  it("Get Accounts", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, πworld!");
    // await greeter.deployed();
    // expect(await greeter.greet()).to.equal("Hello, πworld!");
    // const setGreetingTx = await greeter.setGreeting("Hola, πmundo!");
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    // expect(await greeter.greet()).to.equal("Hola, πmundo!");
    // Connect web3
    // const provider = new ethers.providers.Web3Provider();
    // const accounts = await provider.listAccounts();
    // console.log(accounts[0]);
  });
});

describe("β β β β ArtNFT", function () {
  it("Should deploy ArtNFT contract; get current tokenId", async function () {
    const ArtNFT = await ethers.getContractFactory("ArtNFT");
    const artNFT = await ArtNFT.deploy();
    await artNFT.deployed();

    console.log("β β β ARTNFT has been deployed ...");
    const currentId = await artNFT.getCurrentTokenId();
    console.log(currentId);

    //  const approveTx = await artNFT.approveMarketItem();
    //  const result = await approveTx.wait();
    //  console.log(result);
    // const createTokenTx = await artNFT.createToken("https://nft");

    // // wait until the transaction is mined
    // const result = await createTokenTx.wait();
    // console.log(result);

    expect(currentId).to.equal(0);
  });
});
describe("π π π π π NFTMarket", function () {
  it("Should deploy NFTMarket contract; add and retrieve MarketItem", async function () {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const market = await NFTMarket.deploy();
    await market.deployed();

    console.log("π π π π NFTMarket has been deployed ...");
    const owner = await market.owner();
    console.log(`π π π π owner: ${owner}`);

    const contractAddress = await market.getContractAddress();
    const contractAddress2 = await market.contractAddress();
    console.log(`π π π π contractAddress1: ${contractAddress}`);
    console.log(`π π π π contractAddress2: ${contractAddress2}`);
    const listingPrice = await market.getListingPrice();
    console.log(`π π π π listingPrice: ${listingPrice.toString()}`);
    const price = listingPrice.toString();

    const createTokenTx = await market.addMarketItem(
      contractAddress,
      1,
      2530000000000000
    );
    
    const result = await createTokenTx.wait();
    console.log(`π π π π π π π π result ater wait(): ....`);
    console.log(result);
    
    console.log(`π π π π π π π π fetchItemsCreated ....`);
    const fetchTx = await market.fetchItemsCreated();
    console.log(fetchTx);
    console.log(`πΏπΏπΏπΏ Number of marketItems: π¦ ${fetchTx.length} π¦`);

    expect(owner).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(price).to.equal("2530000000000000");
    expect(fetchTx.length).to.equal(1);
  });
});

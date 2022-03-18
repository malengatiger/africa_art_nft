const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🛎🛎🛎 Greeter", function () {
  it("Get Accounts", async function () {
    // const Greeter = await ethers.getContractFactory("Greeter");
    // const greeter = await Greeter.deploy("Hello, 🛎world!");
    // await greeter.deployed();
    // expect(await greeter.greet()).to.equal("Hello, 🛎world!");
    // const setGreetingTx = await greeter.setGreeting("Hola, 🛎mundo!");
    // // wait until the transaction is mined
    // await setGreetingTx.wait();
    // expect(await greeter.greet()).to.equal("Hola, 🛎mundo!");
    // Connect web3
    // const provider = new ethers.providers.Web3Provider();
    // const accounts = await provider.listAccounts();
    // console.log(accounts[0]);
  });
});

describe("✅ ✅ ✅ ✅ ArtNFT", function () {
  it("Should deploy ArtNFT contract; get current tokenId", async function () {
    const ArtNFT = await ethers.getContractFactory("ArtNFT");
    const artNFT = await ArtNFT.deploy();
    await artNFT.deployed();

    console.log("✅ ✅ ✅ ARTNFT has been deployed ...");
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
describe("🌀 🌀 🌀 🌀 🌀 NFTMarket", function () {
  it("Should deploy NFTMarket contract; add and retrieve MarketItem", async function () {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    const market = await NFTMarket.deploy();
    await market.deployed();

    console.log("🌀 🌀 🌀 🌀 NFTMarket has been deployed ...");
    const owner = await market.owner();
    console.log(`🌀 🌀 🌀 🌀 owner: ${owner}`);

    const contractAddress = await market.getContractAddress();
    const contractAddress2 = await market.contractAddress();
    console.log(`🌀 🌀 🌀 🌀 contractAddress1: ${contractAddress}`);
    console.log(`🌀 🌀 🌀 🌀 contractAddress2: ${contractAddress2}`);
    const listingPrice = await market.getListingPrice();
    console.log(`🌀 🌀 🌀 🌀 listingPrice: ${listingPrice.toString()}`);
    const price = listingPrice.toString();

    const createTokenTx = await market.addMarketItem(
      contractAddress,
      1,
      2530000000000000
    );
    
    const result = await createTokenTx.wait();
    console.log(`🌀 🌀 🌀 🌀 🌀 🌀 🌀 🌀 result ater wait(): ....`);
    console.log(result);
    
    console.log(`🌀 🌀 🌀 🌀 🌀 🌀 🌀 🌀 fetchItemsCreated ....`);
    const fetchTx = await market.fetchItemsCreated();
    console.log(fetchTx);
    console.log(`🌿🌿🌿🌿 Number of marketItems: 🦊 ${fetchTx.length} 🦊`);

    expect(owner).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(price).to.equal("2530000000000000");
    expect(fetchTx.length).to.equal(1);
  });
});

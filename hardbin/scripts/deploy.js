// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("🥬 🥬 🥬  Greeter deployed to: \t🥬 ", greeter.address);
  const ArtNFT = await hre.ethers.getContractFactory("ArtNFT");
  const artNFT = await ArtNFT.deploy();

  await artNFT.deployed();

  console.log("🥬 🥬 🥬  ArtNFT deployed to: \t🥬 ", artNFT.address);

  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const market = await NFTMarket.deploy();

  await market.deployed();

  console.log("🥬 🥬 🥬  NFTMarket deployed to: \t🥬  ", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

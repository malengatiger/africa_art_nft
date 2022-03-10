// eslint-disable-next-line no-undef
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async function (deployer) {
  await deployer.deploy(NFTMarket);
};

// eslint-disable-next-line no-undef
const ArtNFT = artifacts.require("ArtNFT");

module.exports = async function (deployer) {
  await deployer.deploy(ArtNFT);
};

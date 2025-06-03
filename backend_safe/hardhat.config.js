require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/d74f5b383dea457fb9c03ddee73f95d4",
      accounts: ["36afb17f3dc1519cdc04ca69c3274a7cd66d6aeaf15d3bf82d0f0b4c7ebd6327"]
    }
  }
};
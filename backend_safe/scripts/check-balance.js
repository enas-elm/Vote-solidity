const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Solde :", hre.ethers.formatEther(balance), "ETH");
}

main();
const hre = require("hardhat");

async function main() {

  const Safe = await hre.ethers.getContractFactory("Safe");
  const safeInstance = await Safe.deploy();

  await safeInstance.waitForDeployment();
  const [owner] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", owner.address);

  const contractAddress = await safeInstance.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
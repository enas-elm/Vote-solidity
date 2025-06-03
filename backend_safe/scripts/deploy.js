const hre = require("hardhat");

async function main() {

  const Election = await hre.ethers.getContractFactory("Election");
  const electionInstance = await Election.deploy();

  await electionInstance.waitForDeployment();
  const [owner] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", owner.address);

  const contractAddress = await electionInstance.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
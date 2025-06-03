const hre = require("hardhat");

async function main() {
  const Election = await hre.ethers.getContractFactory("Election");
  const election = await Election.deploy();
  await election.waitForDeployment();

  const address = await election.getAddress();
  console.log("✅ Contract deployed at:", address);

  const candidates = ["Alice", "Bob"];
  const tx = await election.initializeCandidates(candidates);
  await tx.wait();
  console.log("✅ Initial candidates set:", candidates);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

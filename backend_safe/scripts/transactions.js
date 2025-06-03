const hre = require("hardhat");

async function main() {

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Safe = await hre.ethers.getContractFactory("Safe");
  const safeAdresse = Safe.attach(contractAddress);

  const [owner, wallet2, wallet3] = await hre.ethers.getSigners();

  const tx = await safeAdresse.connect(owner).sendMoney({
    value: hre.ethers.parseEther("0.1")
  });
  await tx.wait();

  const balance = await safeAdresse.viewBalance()
  console.log("Ton solde est :", hre.ethers.formatEther(balance));


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
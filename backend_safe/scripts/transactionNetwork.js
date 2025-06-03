import hre from "hardhat";
import fs from "fs"

const abi = JSON.parse(fs.readFileSync('/Users/alexcoda/Documents/Projets/IIM/SAFE/backend_safe/artifacts/contracts/Safe.sol/Safe.json')).abi;

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const safe = new ethers.Contract(contractAddress, abi, hre.ethers.provider);

async function main() {
    const balance = await safe.viewBalance()
    console.log("Solde total:", hre.ethers.formatEther(balance));
}

main();
const fs = require("fs");
const path = require("path")
const contractsFile = path.join(__dirname, "..", "backend", "src", "contracts","contract-address.json");
const config = require(`${contractsFile}`);
const hre = require("hardhat");

async function main() {
    console.log(await hre.ethers.provider.getBalance(config.InsecureEtherVault));
}
main().catch((err)=> console.log(err));
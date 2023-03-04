const fs = require("fs");
const path = require("path")
const contractsFile = path.join(__dirname, "..", "backend", "src", "contracts","contract-address.json");
const config = require(`${contractsFile}`);
const hre = require("hardhat");

async function main() {
    InsecureEtherValutFactory = await ethers.getContractFactory('InsecureEtherVault');
    contract = await InsecureEtherValutFactory.attach(config.InsecureEtherVault);
    tx = await contract.unpause();
    console.log(tx);
    console.log(tx.await);
}
main().catch((err)=> console.log(err));
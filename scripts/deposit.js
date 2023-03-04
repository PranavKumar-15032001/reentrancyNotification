const fs = require("fs");
const path = require("path")
const contractsFile = path.join(__dirname, "..", "backend", "src", "contracts","contract-address.json");
const config = require(`${contractsFile}`);
const hre = require("hardhat");

async function main() {
    InsecureEtherValutFactory = await ethers.getContractFactory('InsecureEtherVault');
    contract = await InsecureEtherValutFactory.attach(config.InsecureEtherVault);
    tx = await contract.deposit({value: ethers.utils.parseEther("5.0")});
    console.log(await tx.wait());
    console.log(await hre.ethers.provider.getBalance(contract.address));
}
main().catch((err)=> console.log(err));
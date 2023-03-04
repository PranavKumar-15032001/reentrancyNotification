const path = require("path")
const contractsFile = path.join(__dirname,"..", "contracts","contract-address.json");
const config = require(`${contractsFile}`);
console.log(config);

let contract;
const hre = require("hardhat");
var url = process.env.WS_URL;
var customWsProvider = new hre.ethers.providers.WebSocketProvider(url);
const {blockchainService,gethNodeService} = require("../services");

const startListeners = async () => {
  await blockchainService.initializeContract();
  await gethNodeService.initializeContract();
  blockchainService.hardhatnodeTransactionListener();
  blockchainService.pendingTransactionListener();
  gethNodeService.smartContractEventListener();
} 

module.exports = {
 startListeners
}

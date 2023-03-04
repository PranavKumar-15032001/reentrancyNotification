const path = require("path")
const contractsFile = path.join(__dirname,"..", "contracts","contract-address.json");
const config = require(`${contractsFile}`);
const contractIface = path.join(__dirname,"..", "contracts","InsecureEtherVault.json")
const hre = require('hardhat');
const emailService = require('./email.service');

let gethNodeContract;

const provider =new hre.ethers.providers.JsonRpcProvider(process.env.HTTP_URL);
const signer = new hre.ethers.Wallet(`0x${process.env.DEPLOYER_PRIVATE_KEY}`, provider);

const initializeContract = async () => {
    factory = await hre.ethers.getContractFactory('InsecureEtherVault')
    gethNodeContractFactory = await factory.connect(signer);
    gethNodeContract = await gethNodeContractFactory.attach(config.InsecureEtherVault);
}

const smartContractCall = async(functionName,...args) => {
    return gethNodeContract[functionName](...args);
}
const getContract = () => {
    return gethNodeContract;
}

const smartContractEventListener = () => {
    gethNodeContract.on("WithdrawAllCalled", async (from, to, value, event)=>{
        let eventData ={
            from: from,
            to: to,
            value: value,
            eventData: event,
        }
        console.log(JSON.stringify(eventData, null, 4));
        await emailService.sendEmail('pcom118@gmail.com','Vulnerable Function Called',JSON.stringify(eventData, null, 4));
    });
}

module.exports = {
    initializeContract,
    getContract,
    smartContractCall,
    smartContractEventListener
}
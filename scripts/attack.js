const fs = require("fs");
const path = require("path")
const contractsFile = path.join(__dirname, "..", "backend", "src", "contracts","contract-address.json");
const config = require(`${contractsFile}`);


async function smartContractEventListener () {
    InsecureEtherValutFactory = await ethers.getContractFactory('InsecureEtherVault');
    contract = await InsecureEtherValutFactory.attach(config.InsecureEtherVault);
    contract.on("WithdrawAllCalled", async (from, to, value, event)=>{
        let eventData ={
            from: from,
            to: to,
            value: value,
            eventData: event,
        }
        console.log(JSON.stringify(eventData, null, 4))
        contract.getBalance()
            .then((data) => console.log("Get balance : ",data));
    });
}
smartContractEventListener()

async function main() {
    const [_,deployer] = await ethers.getSigners();
    console.log(deployer);
    const factory = await ethers.getContractFactory("Attack");
    const attack = await factory.deploy(config.InsecureEtherVault);
    await attack.deployed();
    console.log("Smart Contract Deployed");
    console.log(await attack.attack({value: ethers.utils.parseEther("1.0")}));
}
main()
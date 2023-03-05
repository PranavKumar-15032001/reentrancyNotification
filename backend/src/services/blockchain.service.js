const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const hre  = require("hardhat");
const path = require("path");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const contractsFile = path.join(__dirname,"..", "contracts","contract-address.json");
const contractConfig = require(`${contractsFile}`);
const {SimulatedTx} = require('../models');
let hardhatNodeContract;
let deployerAddress = '0x835CDe2Bd64B0A10b467ba0E5dbF4fcF2E37ACA6';
const gethNode = require('./gethNode.service');
const url = process.env.WS_URL;

const initializeContract = async () => {
    InsecureEtherValutFactory = await hre.ethers.getContractFactory('InsecureEtherVault');
    hardhatNodeContract = await InsecureEtherValutFactory.attach(contractConfig.InsecureEtherVault)
  }


const setTransactionFlag = async (txhash,flagName,flagValue) => {
    return SimulatedTx.findOneAndUpdate({'transactionHash' : txhash},{$set : {[flagName] : flagValue}});
}   

const constructHardhatNodeTransaction = (tx) => {
    let tx2 = {
        to: tx.to,
        nonce: tx.nonce,
    
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
    
        data: tx.data,
        value: tx.value,
        chainId: tx.chainId,
    
        // Typed-Transaction features
        type: tx.type,
    }

    if (tx.accessList) {
        // EIP-2930; Type 1 & EIP-1559; Type 2
        tx2.accessList = tx.accessList              
    }

    if (tx.type == 2) {
        // EIP-1559; Type 2
        tx2.maxPriorityFeePerGas = tx.maxPriorityFeePerGas,
        tx2.maxFeePerGas = tx.maxFeePerGas
        tx2.gasPrice = tx.maxFeePerGas
    } 
  
    let raw = hre.ethers.utils.serializeTransaction(tx2, {
        r: tx.r,
        s: tx.s,
        v: tx.v
    })
    return raw;
}

const toProcessTransaction = async (tx) => {
    console.log(tx);
    dbTx = await SimulatedTx.findOneAndUpdate({'transactionHash' : tx.hash},{"$setOnInsert" : {tx : tx}},{upsert : true,new : true});
    if(dbTx.simulated)return false;
    return true;
}

const simulateTransaction = async (tx) => {
    console.log('Current Block Number : ',await hre.ethers.provider.getBlock('latest'));
    // console.log('Helpers Reset Output : ',await helpers.reset(process.env.HTTP_URL));
    await helpers.impersonateAccount(tx.from);
    if(tx.nonce > 0)
        await helpers.setNonce(tx.from,tx.nonce);
    await helpers.setBalance(tx.from,tx.value.add(hre.ethers.utils.parseEther('1')));
    var rawTx = constructHardhatNodeTransaction(tx);
    sendTx = await hre.ethers.provider.sendTransaction(rawTx);
    console.log('hardhat transaction',await sendTx.wait());
    await helpers.stopImpersonatingAccount(tx.from);
}

const simulatePendingTransaction = async (txHash, provider)  => {
    const tx = await provider.getTransaction(txHash);
    const toProcess = await toProcessTransaction(tx);
    if(toProcess) {
        await simulateTransaction(tx);
    }
    await setTransactionFlag(tx.hash,'simulated',true);
}


const processVulneralbeExecution = async (txHash) => {
    console.log(txHash);
    const data = await setTransactionFlag(txHash,'flagged',true);
    console.log(data);
    if(!!data && !data.flagged) {
        console.log(5*parseInt(data.tx.gasPrice._hex));
        console.log('Pause Transaction' ,await gethNode.smartContractCall('pause',{gasPrice : 2*parseInt(data.tx.gasPrice._hex)}));
    }
}

const hardhatnodeTransactionListener = () => {
    hardhatNodeContract.on("WithdrawAllCalled", (from, to, value, event)=>{
        if(value?.transactionHash) {
            processVulneralbeExecution(value?.transactionHash).then().catch((err) => console.log(err));
        }
      });
}


const pendingTransactionListener = () => {
    var customWsProvider = new hre.ethers.providers.WebSocketProvider(url);

    customWsProvider.on("pending", (tx) => {
        simulatePendingTransaction(tx,customWsProvider).then().catch((err)=>console.log("Error inside simulation : ",err));
    });

    customWsProvider._websocket.on("error", async () => {
      console.log(`Unable to connect to retrying in 3s...`);
      setTimeout(init, 3000);
    });
    customWsProvider._websocket.on("close", async (code) => {
      console.log(
        `Connection lost with code ${code}! Attempting reconnect in 3s...`
      );
      customWsProvider._websocket.terminate();
      setTimeout(init, 3000);
    });
}

module.exports = {
    simulatePendingTransaction,
    initializeContract,
    hardhatnodeTransactionListener,
    pendingTransactionListener
}
require("@nomicfoundation/hardhat-toolbox");
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      chainId : 15032001,
      forking : {
        url : "http://127.0.0.1:8545"
      }
    },
    geth : {
      chainId : 15032001,
      url : "http://127.0.0.1:8545",
      gas: 2100000,
      gasPrice: 6000000000,
      accounts : [`${process.env.DEPLOYER_PRIVATE_KEY}`,`${process.env.ATTACKER_PRIVATE_KEY}`]
    }
  }
};
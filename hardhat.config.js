require("@nomicfoundation/hardhat-toolbox");
// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.13",
  networks: {
    hardhat: {
      forking : {
        url : `https://eth-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`
      },
      mining : {
        auto: false,
        interval: 5000
      }
    }
  }
};

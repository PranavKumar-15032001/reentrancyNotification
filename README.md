# Hardhat Boilerplate

The execution is as follows :

```bash
git clone https://github.com/PranavKumar-15032001/reentrancyNotification
```

```bash
cd reentrancyNotification
```

## To run the Geth Node

```bash
  cd geth
  geth init --datadir data genesis.json
  bash bash start-geth.sh
```

## Build and Deploy the smart contract

Build the project from root directory and deploy the smart contract:

```bash
npm i
npx hardhat run scripts/deploy.js --network geth #Deploy Vault Smart Contract
```

## Backend server

In another terminal start backend server from root directory :

```bash
yarn start
```

## Attack Scripts

Runt the following scripts in seprate terminal

```bash
npx hardhat run scripts/deposit.js --network geth #Deposit into the vault
npx hardhat run scripts/attack.js --network geth #Attack the vault smart contract
npx hardhat run scripts/unpause.js --network geth #Unpause Vault Smart Contract
```

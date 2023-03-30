# Reentrancy Notification Prevention

## Problem Statement
1. Smart contract in the solidity vulnerable to a Reentrancy attack having Ownable and Pausable functionalities, and emitting event when vulnerable function is executed.
2. Notification microservice for the execution of the vulnerable function.
3. Monitor the mempool, and when the transaction is in the Mempool but is yet to be executed (or added in the next block), flag this transaction as a suspicious transaction. 
4. Microservice that frontruns the suspicious transaction by executing the pause function.

## Solution
1. Configured private Geth Node for blockchain.
2. Vulnerable smart contract using classic reentrancy example of vault.
3. Attack smart contract for attacking the vault smart contract.
4. Another hardhat node started as forking from Geth Node.
5. Listening to pending transactions on the geth node.
6. If vulnerable event emitted on the pending transaction while execution in hardhat node, then marking it as suspicious.
7. Front running the suspicious transaction with pause transaction.

The execution is as follows :

# Simulation

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

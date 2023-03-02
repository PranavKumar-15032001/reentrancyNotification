// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const InsecureEtherVault = await ethers.getContractFactory("InsecureEtherVault");
  const insecureEtherVault = await InsecureEtherVault.deploy();
  await insecureEtherVault.deployed();

  console.log("InsecureEtherVault address:", insecureEtherVault.address);
  console.log("Owner Address",await insecureEtherVault.owner());
  await insecureEtherVault.deposit({value: ethers.utils.parseEther("5.0")});
  console.log("Balance " , await insecureEtherVault.getBalance());
  // We also save the contract's artifacts and address in the frontend directory
  saveBackendFiles(insecureEtherVault);
}

function saveBackendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "backend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ InsecureEtherVault: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("InsecureEtherVault");

  fs.writeFileSync(
    path.join(contractsDir, "InsecureEtherVault.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

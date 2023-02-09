import { ethers } from "hardhat";

async function main() {
  const lightClientFactory = await ethers.getContractFactory("ETHLightClient");
  const lightClient = await lightClientFactory.deploy();

  await lightClient.deployed();

  console.log(`Light client deployed to ${lightClient.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

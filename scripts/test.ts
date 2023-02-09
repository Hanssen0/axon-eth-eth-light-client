import { ethers } from "hardhat";
async function main() {
  const lightClientFactory = await ethers.getContractFactory("ETHLightClient");
  const lightClient = lightClientFactory.attach("0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1");
  
  const ethProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");

  let nowBlock = await ethProvider.getBlockNumber();
  const blocks = [];
  
  while (true) {
    const latest = await ethProvider.getBlockNumber();
    for (; nowBlock < latest; nowBlock += 1) {
      blocks.push(await ethProvider.getBlock(nowBlock));
    }
    
    while (blocks.length !== 0) {
      const now = Math.floor(Date.now() / 1000);
      if (now - blocks[0].timestamp < 55) {
        console.log(blocks.length, now, blocks[0]?.timestamp);
        break;
      }
      const block = blocks.shift()!;

      const log1 = await lightClient.isValid(
        block.timestamp,
        block.hash,
      );

      const log1Res = await log1.wait();
      console.log(now, block.timestamp, block.hash, log1Res.events?.map((e) => e.args));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

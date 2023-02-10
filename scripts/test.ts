import { ethers } from "hardhat";
async function main() {
  const lightClientFactory = await ethers.getContractFactory("ETHLightClient");
  const lightClient = lightClientFactory.attach("0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f");
  
  const ethProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");

  let nowBlock = (await lightClient.getLatestBlockNumber()).toNumber() + 1;
  const blocks = [];
  
  while (true) {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const latest = await ethProvider.getBlockNumber();

    if (nowBlock < latest) {
      const newBlock = await ethProvider.getBlock(nowBlock);
      blocks.push(newBlock);
      console.log(blocks.length, now, newBlock.timestamp);
      nowBlock += 1;
    }
    
    while (blocks.length !== 0) {
      if (now - blocks[0].timestamp < 55) {
        break;
      }
      const block = blocks.shift()!;
      console.log(block.timestamp, block.hash, block.parentHash, block.number)

      const log1 = await lightClient.relayBlock(
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

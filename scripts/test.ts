import { ethers } from "hardhat";
async function main() {
  const lightClientFactory = await ethers.getContractFactory("ETHLightClient");
  const lightClient = lightClientFactory.attach("0x7B3754E8aF59Cf676ad123c8A2643f6c77E50C4A");

  const ethProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");

  let nowBlock = (await lightClient.getLatestBlockNumber()).toNumber() + 1;
  const blocks = [];

  while (true) {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const latest = await ethProvider.getBlockNumber();

    if (nowBlock < latest) {
      const newBlock = await ethProvider.getBlock(nowBlock);
      blocks.push(newBlock);
      nowBlock += 1;
    }

    while (blocks.length !== 0) {
      if (now - blocks[0].timestamp < 55) {
        break;
      }
      const block = blocks.shift()!;

      const relay = await (await lightClient.relayBlock(
        block.timestamp,
        block.hash,
      )).wait();

      const blockNumber = await lightClient.getLatestBlockNumber();
      const blockHash = await lightClient.getBlockHashByNumber(blockNumber);
      console.log(
        blockNumber.toString(),
        blockHash,
        await lightClient.getBlockByHash(blockHash),
        relay.events,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

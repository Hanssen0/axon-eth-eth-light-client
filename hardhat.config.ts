import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const AXON_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    axonTest: {
      url: "http://localhost:8000",
      accounts: [AXON_PRIVATE_KEY]
    }
  },
};

export default config;

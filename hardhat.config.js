import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";

const DEPLOYER_KEY = process.env.BASE_SEPOLIA_PRIVATE_KEY || "0x" + "0".repeat(64);

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: "0.8.24",
  networks: {
    base_sepolia: {
      type: "http",
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      accounts: [DEPLOYER_KEY],
      chainId: 84532,
    },
  },
});

import hre from "hardhat";

async function main() {
  const { ethers, network } = await hre.network.connect();

  console.log(`Deploying to ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  console.log("\nDeploying BaseUnifiedStackBenchmark...");
  const bench = await ethers.deployContract("BaseUnifiedStackBenchmark");
  await bench.waitForDeployment();
  const address = await bench.getAddress();
  console.log(`Deployed at: ${address}`);

  console.log("\nRunning benchmarks on-chain...");

  const baseUpgrade = await bench.simulateBaseUpgrade(10);
  await baseUpgrade.wait();
  console.log("  Base upgrade: done");

  const opUpgrade = await bench.simulateOpStackUpgrade(10);
  await opUpgrade.wait();
  console.log("  OP Stack upgrade: done");

  const baseOps = await bench.simulateBaseNodeOps(20);
  await baseOps.wait();
  console.log("  Base node ops: done");

  const opOps = await bench.simulateOpStackNodeOps(20);
  await opOps.wait();
  console.log("  OP Stack node ops: done");

  const baseFeature = await bench.simulateBaseCustomFeature(15);
  await baseFeature.wait();
  console.log("  Base custom feature: done");

  const opFeature = await bench.simulateOpStackCustomFeature(15);
  await opFeature.wait();
  console.log("  OP Stack custom feature: done");

  console.log(`\nTotal results stored: ${await bench.getResultCount()}`);
  console.log(`\nVerify on BaseScan: https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

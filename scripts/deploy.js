import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying to Base Sepolia...`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  console.log("\nDeploying BaseUnifiedStackBenchmark...");
  const factory = await ethers.getContractFactory("BaseUnifiedStackBenchmark");
  const bench = await factory.deploy();
  await bench.waitForDeployment();
  const address = await bench.getAddress();
  console.log(`Deployed at: ${address}`);

  // Attach to deployed contract with full ABI
  const benchContract = await ethers.getContractAt("BaseUnifiedStackBenchmark", address);

  console.log("\nRunning benchmarks on-chain...");

  let tx = await benchContract.simulateBaseUpgrade(10);
  await tx.wait();
  console.log("  Base upgrade: done");

  tx = await benchContract.simulateOpStackUpgrade(10);
  await tx.wait();
  console.log("  OP Stack upgrade: done");

  tx = await benchContract.simulateBaseNodeOps(20);
  await tx.wait();
  console.log("  Base node ops: done");

  tx = await benchContract.simulateOpStackNodeOps(20);
  await tx.wait();
  console.log("  OP Stack node ops: done");

  tx = await benchContract.simulateBaseCustomFeature(15);
  await tx.wait();
  console.log("  Base custom feature: done");

  tx = await benchContract.simulateOpStackCustomFeature(15);
  await tx.wait();
  console.log("  OP Stack custom feature: done");

  const count = await benchContract.getResultCount();
  console.log(`\nTotal results stored: ${count}`);

  console.log("\nFetching results from chain...");
  for (let i = 0; i < Number(count); i++) {
    const r = await benchContract.getResult(i);
    console.log(`  [${i}] ${r.stack} | ${r.operation} | ${r.gasUsed} gas | block ${r.blockNumber}`);
  }

  console.log(`\nVerify on BaseScan: https://sepolia.basescan.org/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

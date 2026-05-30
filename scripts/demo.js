import hre from "hardhat";

async function main() {
  console.log("═".repeat(60));
  console.log("  Base Unified Stack — Gas Benchmark Demo");
  console.log("  Proving Base's technical autonomy benefits");
  console.log("═".repeat(60));

  const { ethers } = await hre.network.connect();

  // Deploy
  console.log("\n📦 Deploying BaseUnifiedStackBenchmark...");
  const bench = await ethers.deployContract("BaseUnifiedStackBenchmark");
  await bench.waitForDeployment();
  console.log(`✅ Deployed at: ${await bench.getAddress()}\n`);

  // ═══ 1. Upgrade Simulation ═══
  console.log("━".repeat(60));
  console.log("  1️⃣  UPGRADE SIMULATION (10 state slots)");
  console.log("━".repeat(60));

  const baseUpgrade = await bench.simulateBaseUpgrade(10);
  const r1 = await baseUpgrade.wait();
  console.log(`  Base unified stack:  ${r1.gasUsed} gas (1 repo)`);

  const opUpgrade = await bench.simulateOpStackUpgrade(10);
  const r2 = await opUpgrade.wait();
  console.log(`  OP Stack:            ${r2.gasUsed} gas (4 repos + reconciliation)`);

  const upgradeSavings = ((Number(r2.gasUsed) - Number(r1.gasUsed)) * 100) / Number(r2.gasUsed);
  console.log(`  ⚡ Base saves ${upgradeSavings.toFixed(1)}% gas on upgrades\n`);

  // ═══ 2. Node Operator Migration ═══
  console.log("━".repeat(60));
  console.log("  2️⃣  NODE OPERATOR MIGRATION (20 ops)");
  console.log("━".repeat(60));

  const baseOps = await bench.simulateBaseNodeOps(20);
  const r3 = await baseOps.wait();
  console.log(`  Base unified stack:  ${r3.gasUsed} gas (1 repo)`);

  const opOps = await bench.simulateOpStackNodeOps(20);
  const r4 = await opOps.wait();
  console.log(`  OP Stack:            ${r4.gasUsed} gas (4 repos)`);

  const opsSavings = ((Number(r4.gasUsed) - Number(r3.gasUsed)) * 100) / Number(r4.gasUsed);
  console.log(`  ⚡ Node operators save ${opsSavings.toFixed(1)}% on Base\n`);

  // ═══ 3. Custom Feature Integration ═══
  console.log("━".repeat(60));
  console.log("  3️⃣  CUSTOM FEATURE (TEE/ZK) — 15 complexity");
  console.log("━".repeat(60));

  const baseFeature = await bench.simulateBaseCustomFeature(15);
  const r5 = await baseFeature.wait();
  console.log(`  Base unified stack:  ${r5.gasUsed} gas (direct integration)`);

  const opFeature = await bench.simulateOpStackCustomFeature(15);
  const r6 = await opFeature.wait();
  console.log(`  OP Stack:            ${r6.gasUsed} gas (alliance coordination)`);

  const featureSavings = ((Number(r6.gasUsed) - Number(r5.gasUsed)) * 100) / Number(r6.gasUsed);
  console.log(`  ⚡ Custom features ${featureSavings.toFixed(1)}% cheaper on Base\n`);

  // ═══ Summary ═══
  console.log("═".repeat(60));
  console.log("  📊 SUMMARY — Why Base Left OP Stack");
  console.log("═".repeat(60));
  console.log(`  Upgrade efficiency:     +${upgradeSavings.toFixed(1)}%`);
  console.log(`  Node operator savings:  +${opsSavings.toFixed(1)}%`);
  console.log(`  Custom feature savings: +${featureSavings.toFixed(1)}%`);
  console.log(`  On-chain records:       ${await bench.getResultCount()}`);
  console.log("\n  📄 All results stored on-chain — verifiable by anyone");
  console.log("═".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

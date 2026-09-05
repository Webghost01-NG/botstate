const { execSync } = require('child_process');

console.log('\n🔍 VERIFYING BOTSTATE CONTRACTS ON BOT CHAIN MAINNET (scan.botchain.ai)');
console.log('========================================================================');

const deployment = require('../../frontend/app/data/active-deployment.json');
const contracts = deployment.records.map(({ name, address }) => ({
  name, address, args: name === 'AgentActionLog' ? deployment.deployer : ''
}));

for (const c of contracts) {
  try {
    console.log(`\n⏳ Verifying ${c.name} at ${c.address}...`);
    const cmd = `npx hardhat verify --network botchain ${c.address} ${c.args}`.trim();
    const output = execSync(cmd, { encoding: 'utf8' });
    console.log(output);
  } catch (err) {
    console.log(`ℹ️ Result for ${c.name}:`, err.stdout || err.message);
  }
}

console.log('\n✅ VERIFICATION SCRIPT EXECUTED!');

const { execSync } = require('child_process');

console.log('\n🔍 VERIFYING BOTSTATE CONTRACTS ON BOT CHAIN MAINNET (scan.botchain.ai)');
console.log('========================================================================');

const contracts = [
  { name: 'PropertyRegistry', address: '0x8cd2DA9E45D18c47A803f065a3625AE68bF37B17', args: '' },
  { name: 'RWATokenFactory', address: '0x0908E0409d593409D251306302FDca0C45198B9C', args: '' },
  { name: 'Marketplace', address: '0x08D1B8fD3b831e79f000fFA3B1B0F69064080f24', args: '' },
  { name: 'AgentActionLog', address: '0xbb42F96B7Dd1FC127f7A9729C178EFE15ADa8F0a', args: '0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2' }
];

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

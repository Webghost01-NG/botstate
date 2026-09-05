// Generates public build artifacts only. Never loads credentials or submits transactions.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { keccak256 } = require('ethers');
const names = ['PropertyRegistry', 'RWATokenFactory', 'Marketplace', 'AgentActionLog', 'SamplePropertyToken'];
const contracts = {};
for (const name of names) {
  const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, '../artifacts/contracts', name + '.sol', name + '.json')));
  contracts[name] = { abi: artifact.abi, bytecode: artifact.bytecode, runtimeBytecode: artifact.deployedBytecode, runtimeHash: keccak256(artifact.deployedBytecode) };
}
const sources = fs.readdirSync(path.join(__dirname, '../contracts')).filter(p => p.endsWith('.sol')).sort();
const sourceHash = crypto.createHash('sha256');
for (const file of sources) sourceHash.update(file).update(fs.readFileSync(path.join(__dirname, '../contracts', file)));
const result = { version: 'metamask-samples-v1', compiler: '0.8.20', optimizerRuns: 200, evmVersion: 'paris', chainId: 677, sourceHash: sourceHash.digest('hex'), contracts };
const target = path.join(__dirname, '../../frontend/app/data/browser-artifacts.json');
const content = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== content) throw new Error('Browser artifacts do not match compiled contracts');
} else {
  fs.writeFileSync(target, content);
  console.log('Exported public browser deployment artifacts');
}

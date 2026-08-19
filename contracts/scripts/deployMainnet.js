const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const rpc = 'https://rpc.botchain.ai';
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(rpc, 677);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('\n🚀 DEPLOYING BOTSTATE TO BOT CHAIN MAINNET (Chain ID 677)');
  console.log('📍 Deployer Address:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Mainnet Balance:', ethers.formatEther(balance), 'BOT');

  if (balance === 0n) {
    console.error('❌ No BOT balance found on Mainnet!');
    process.exit(1);
  }

  const gasPrice = ethers.parseUnits('25', 'gwei');
  console.log('⚡ Using Gas Price: 25 Gwei');

  function loadArtifact(contractName) {
    const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
    return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  }

  let currentNonce = await provider.getTransactionCount(wallet.address, 'latest');
  console.log('📌 Starting Nonce:', currentNonce);

  // 1. PropertyRegistry
  console.log('\n1️⃣ Deploying PropertyRegistry...');
  const prArtifact = loadArtifact('PropertyRegistry');
  const prFactory = new ethers.ContractFactory(prArtifact.abi, prArtifact.bytecode, wallet);
  const prContract = await prFactory.deploy({ gasPrice, nonce: currentNonce++ });
  console.log('   Tx Hash:', prContract.deploymentTransaction().hash);
  const prReceipt = await prContract.deploymentTransaction().wait(1);
  const prAddress = await prContract.getAddress();
  console.log('   ✅ PropertyRegistry deployed at:', prAddress, `(Block ${prReceipt.blockNumber})`);

  // 2. RWATokenFactory
  console.log('\n2️⃣ Deploying RWATokenFactory...');
  const rwaArtifact = loadArtifact('RWATokenFactory');
  const rwaFactory = new ethers.ContractFactory(rwaArtifact.abi, rwaArtifact.bytecode, wallet);
  const rwaContract = await rwaFactory.deploy({ gasPrice, nonce: currentNonce++ });
  console.log('   Tx Hash:', rwaContract.deploymentTransaction().hash);
  const rwaReceipt = await rwaContract.deploymentTransaction().wait(1);
  const rwaAddress = await rwaContract.getAddress();
  console.log('   ✅ RWATokenFactory deployed at:', rwaAddress, `(Block ${rwaReceipt.blockNumber})`);

  // 3. Marketplace
  console.log('\n3️⃣ Deploying Marketplace...');
  const mpArtifact = loadArtifact('Marketplace');
  const mpFactory = new ethers.ContractFactory(mpArtifact.abi, mpArtifact.bytecode, wallet);
  const mpContract = await mpFactory.deploy({ gasPrice, nonce: currentNonce++ });
  console.log('   Tx Hash:', mpContract.deploymentTransaction().hash);
  const mpReceipt = await mpContract.deploymentTransaction().wait(1);
  const mpAddress = await mpContract.getAddress();
  console.log('   ✅ Marketplace deployed at:', mpAddress, `(Block ${mpReceipt.blockNumber})`);

  // 4. AgentActionLog
  console.log('\n4️⃣ Deploying AgentActionLog...');
  const aalArtifact = loadArtifact('AgentActionLog');
  const aalFactory = new ethers.ContractFactory(aalArtifact.abi, aalArtifact.bytecode, wallet);
  const aalContract = await aalFactory.deploy(wallet.address, { gasPrice, nonce: currentNonce++ });
  console.log('   Tx Hash:', aalContract.deploymentTransaction().hash);
  const aalReceipt = await aalContract.deploymentTransaction().wait(1);
  const aalAddress = await aalContract.getAddress();
  console.log('   ✅ AgentActionLog deployed at:', aalAddress, `(Block ${aalReceipt.blockNumber})`);

  // Save deployed addresses
  const addresses = {
    network: 'botchainMainnet',
    chainId: 677,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    receipts: {
      PropertyRegistry: { address: prAddress, txHash: prContract.deploymentTransaction().hash, block: prReceipt.blockNumber },
      RWATokenFactory: { address: rwaAddress, txHash: rwaContract.deploymentTransaction().hash, block: rwaReceipt.blockNumber },
      Marketplace: { address: mpAddress, txHash: mpContract.deploymentTransaction().hash, block: mpReceipt.blockNumber },
      AgentActionLog: { address: aalAddress, txHash: aalContract.deploymentTransaction().hash, block: aalReceipt.blockNumber }
    }
  };

  const sharedDir = path.join(__dirname, '..', '..', 'shared');
  if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(path.join(sharedDir, 'mainnet-deployed-addresses.json'), JSON.stringify(addresses, null, 2));

  console.log('\n🎉 ALL 4 CONTRACTS SUCCESSFULLY CONFIRMED ON BOT CHAIN MAINNET!');
  console.log('====================================================');
  console.log('PropertyRegistry :', prAddress);
  console.log('RWATokenFactory  :', rwaAddress);
  console.log('Marketplace      :', mpAddress);
  console.log('AgentActionLog   :', aalAddress);
  console.log('Mainnet Explorer : https://scan.botchain.ai');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('\n❌ Mainnet Deployment Error:', err);
  process.exit(1);
});

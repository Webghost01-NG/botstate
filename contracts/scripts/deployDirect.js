const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const rpc = process.env.BOTCHAIN_TESTNET_RPC || 'https://rpc.bohr.life';
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(rpc, 968);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('\n🚀 Deploying BOTSTATE Smart Contracts to BOT Chain Testnet');
  console.log('📍 Deployer Address:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Balance:', ethers.formatEther(balance), 'tBOT');

  const feeData = await provider.getFeeData();
  const gasPrice = ethers.parseUnits('60', 'gwei'); // High gas price to prioritize in mempool
  console.log('⚡ Using Gas Price: 60 Gwei');

  function loadArtifact(contractName) {
    const artifactPath = path.join(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
    return JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  }

  let currentNonce = await provider.getTransactionCount(wallet.address, 'latest');
  console.log('📌 Current Nonce:', currentNonce);

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
    network: 'botchainTestnet',
    chainId: 968,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      PropertyRegistry: prAddress,
      RWATokenFactory: rwaAddress,
      Marketplace: mpAddress,
      AgentActionLog: aalAddress
    }
  };

  const sharedDir = path.join(__dirname, '..', '..', 'shared');
  if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(path.join(sharedDir, 'deployed-addresses.json'), JSON.stringify(addresses, null, 2));

  // Sync backend .env
  const backendEnvPath = path.join(__dirname, '..', '..', 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    let envContent = fs.readFileSync(backendEnvPath, 'utf8');
    envContent = envContent.replace(/PROPERTY_REGISTRY_ADDRESS=.*/g, `PROPERTY_REGISTRY_ADDRESS=${prAddress}`);
    envContent = envContent.replace(/RWA_TOKEN_FACTORY_ADDRESS=.*/g, `RWA_TOKEN_FACTORY_ADDRESS=${rwaAddress}`);
    envContent = envContent.replace(/MARKETPLACE_ADDRESS=.*/g, `MARKETPLACE_ADDRESS=${mpAddress}`);
    envContent = envContent.replace(/AGENT_LOG_ADDRESS=.*/g, `AGENT_LOG_ADDRESS=${aalAddress}`);
    fs.writeFileSync(backendEnvPath, envContent);
    console.log('\n🔄 Automatically synced contract addresses to backend/.env');
  }

  console.log('\n🎉 ALL 4 CONTRACTS SUCCESSFULLY CONFIRMED ON BOT CHAIN TESTNET!');
  console.log('====================================================');
  console.log('PropertyRegistry :', prAddress);
  console.log('RWATokenFactory  :', rwaAddress);
  console.log('Marketplace      :', mpAddress);
  console.log('AgentActionLog   :', aalAddress);
  console.log('Explorer URL     : https://scan.bohr.life');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('\n❌ Deployment error:', err);
  process.exit(1);
});

const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const network = hre.network.name;
  const currencySymbol = network.toLowerCase().includes('testnet') ? 'tBOT' : (network === 'botchain' ? 'BOT' : 'ETH');
  
  console.log(`\n🚀 BOTSTATE Contract Deployment`);
  console.log(`   Network: ${network}`);
  console.log(`   Chain ID: ${hre.network.config.chainId || 'local'}`);
  console.log('─'.repeat(50));

  const [deployer] = await hre.ethers.getSigners();
  console.log(`\n📍 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ${currencySymbol}`);
  
  if (balance === 0n) {
    console.error('\n❌ Deployer has no balance! Fund your wallet first.');
    process.exit(1);
  }

  console.log('\n📦 Deploying contracts...\n');

  // 1. PropertyRegistry
  console.log('Deploying PropertyRegistry...');
  const PropertyRegistry = await hre.ethers.getContractFactory('PropertyRegistry');
  const propertyRegistry = await PropertyRegistry.deploy();
  await propertyRegistry.waitForDeployment();
  const registryAddr = await propertyRegistry.getAddress();
  console.log(`✅ PropertyRegistry:  ${registryAddr}`);

  // 2. RWATokenFactory
  console.log('Deploying RWATokenFactory...');
  const RWATokenFactory = await hre.ethers.getContractFactory('RWATokenFactory');
  const rwaTokenFactory = await RWATokenFactory.deploy();
  await rwaTokenFactory.waitForDeployment();
  const factoryAddr = await rwaTokenFactory.getAddress();
  console.log(`✅ RWATokenFactory:   ${factoryAddr}`);

  // 3. Marketplace
  console.log('Deploying Marketplace...');
  const Marketplace = await hre.ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  const marketAddr = await marketplace.getAddress();
  console.log(`✅ Marketplace:       ${marketAddr}`);

  // 4. AgentActionLog
  console.log('Deploying AgentActionLog...');
  const AgentActionLog = await hre.ethers.getContractFactory('AgentActionLog');
  const agentActionLog = await AgentActionLog.deploy(deployer.address);
  await agentActionLog.waitForDeployment();
  const agentLogAddr = await agentActionLog.getAddress();
  console.log(`✅ AgentActionLog:    ${agentLogAddr}`);

  // Save deployed addresses
  const addresses = {
    network,
    chainId: hre.network.config.chainId || 31337,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      PropertyRegistry: registryAddr,
      RWATokenFactory: factoryAddr,
      Marketplace: marketAddr,
      AgentActionLog: agentLogAddr
    }
  };

  // Save to shared directory
  const sharedDir = path.join(__dirname, '..', '..', 'shared');
  if (!fs.existsSync(sharedDir)) fs.mkdirSync(sharedDir, { recursive: true });
  
  const addressFile = path.join(sharedDir, 'deployed-addresses.json');
  fs.writeFileSync(addressFile, JSON.stringify(addresses, null, 2));
  console.log(`\n📄 Addresses saved to: ${addressFile}`);

  // Auto-update backend .env
  const backendEnvPath = path.join(__dirname, '..', '..', 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    let envContent = fs.readFileSync(backendEnvPath, 'utf8');
    envContent = envContent.replace(/PROPERTY_REGISTRY_ADDRESS=.*/g, `PROPERTY_REGISTRY_ADDRESS=${registryAddr}`);
    envContent = envContent.replace(/RWA_TOKEN_FACTORY_ADDRESS=.*/g, `RWA_TOKEN_FACTORY_ADDRESS=${factoryAddr}`);
    envContent = envContent.replace(/MARKETPLACE_ADDRESS=.*/g, `MARKETPLACE_ADDRESS=${marketAddr}`);
    envContent = envContent.replace(/AGENT_LOG_ADDRESS=.*/g, `AGENT_LOG_ADDRESS=${agentLogAddr}`);
    fs.writeFileSync(backendEnvPath, envContent);
    console.log(`🔄 Automatically synced addresses into backend/.env`);
  }

  // Verification instructions
  if (network === 'botchainTestnet') {
    console.log('\n🔍 Verify contracts on BOT Chain Testnet Explorer (https://scan.bohr.life):');
    console.log(`   npx hardhat verify --network botchainTestnet ${registryAddr}`);
    console.log(`   npx hardhat verify --network botchainTestnet ${factoryAddr}`);
    console.log(`   npx hardhat verify --network botchainTestnet ${marketAddr}`);
    console.log(`   npx hardhat verify --network botchainTestnet ${agentLogAddr} "${deployer.address}"`);
  } else if (network === 'botchain') {
    console.log('\n🔍 Verify contracts on BOT Chain Mainnet Explorer (https://scan.botchain.ai):');
    console.log(`   npx hardhat verify --network botchain ${registryAddr}`);
    console.log(`   npx hardhat verify --network botchain ${factoryAddr}`);
    console.log(`   npx hardhat verify --network botchain ${marketAddr}`);
    console.log(`   npx hardhat verify --network botchain ${agentLogAddr} "${deployer.address}"`);
  }

  console.log('\n✨ Deployment complete!\n');
}

main().catch((error) => {
  console.error('\n❌ Deployment failed:', error);
  process.exitCode = 1;
});

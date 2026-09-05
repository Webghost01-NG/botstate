import assert from 'node:assert/strict';
import { Contract } from 'ethers';
import deployment from '../app/data/active-deployment.json' with { type: 'json' };
import { artifact, readProvider, verifyJournal, VERSION } from '../app/utils/deployment.mjs';

const provider = readProvider();
try {
  const result = await verifyJournal({
    version: VERSION,
    account: deployment.deployer,
    entries: deployment.transactions.map(({ step, hash }) => ({ step, hash }))
  }, provider);
  assert.equal(result.completed, 6);
  for (const record of deployment.records) {
    assert.equal(result.addresses[record.name], record.address);
    assert.equal(artifact(record.name).runtimeHash, record.runtimeHash);
  }
  assert.equal(result.addresses.SamplePropertyToken, deployment.sample.address);
  assert.equal(artifact('SamplePropertyToken').runtimeHash, deployment.sample.runtimeHash);
  for (const record of deployment.transactions) {
    assert.equal(result.receipts[record.step].blockNumber, record.blockNumber);
  }
  const factory = new Contract(deployment.contracts.RWATokenFactory, artifact('RWATokenFactory').abi, provider);
  const registry = new Contract(deployment.contracts.PropertyRegistry, artifact('PropertyRegistry').abi, provider);
  const token = new Contract(deployment.sample.address, artifact('SamplePropertyToken').abi, provider);
  assert.equal(await factory.propertyTokens(900001), deployment.sample.address);
  const property = await registry.getProperty(900001);
  assert.equal(property.isActive, true);
  assert.equal(property.metadataURI, 'https://frontend-ecru-nu-85.vercel.app/samples/900001.json');
  assert.equal(await token.isSampleAsset(), true);
  assert.equal(await token.faucetAmount(), 10n * 10n ** 18n);
  assert.equal(await token.totalSupply(), 100000n * 10n ** 18n);
  console.log('Verified all six mainnet transactions and all five exact contract runtimes.');
  console.log(JSON.stringify(result.addresses, null, 2));
} finally {
  provider.destroy();
}

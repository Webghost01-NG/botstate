import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sampleValuation, catalogReply } from '../app/utils/catalog.mjs';
import { matchesDeployment, deployments, requireMainnet, readPortfolio } from '../app/utils/chain.mjs';

test('catalog never fabricates a wallet balance or signs an appraisal', () => {
  assert.deepEqual(catalogReply('wallet balance',[]).properties,[]);
  const value=sampleValuation({id:'sample',name:'Sample',price:100});
  assert.equal(value.valuation.appraisedValueUSD,null);
  assert.equal(value.eip712Attestation,null);
  assert.equal(value.signingEnabled,false);
  assert.throws(()=>catalogReply(null,[]));
});
test('confirmation requires the exact successful creation receipt and deployed code', () => {
  const d=deployments[0];
  const r={status:'0x1',transactionHash:d.txHash,contractAddress:d.address,blockNumber:'0x'+d.block.toString(16)};
  assert.equal(matchesDeployment(d,r,'0x1234'),true);
  for(const bad of [null,{...r,status:'0x0'},{...r,contractAddress:deployments[1].address},{...r,transactionHash:deployments[1].txHash}]) assert.equal(matchesDeployment(d,bad,'0x1234'),false);
  assert.equal(matchesDeployment(d,r,'0x'),false);
});
test('wrong networks and unavailable RPC fail without substitute balances',async()=>{
  await assert.rejects(requireMainnet(async()=> '0x3c8'),/mismatch/);
  await assert.rejects(readPortfolio('invalid'),/Invalid/);
  await assert.rejects(readPortfolio(deployments[0].address,async()=>{throw new Error('offline');}),/offline/);
});
test('payment pages cannot send transfers or fabricate stored holdings',()=>{
  for(const path of ['properties/[id]/page.js','properties/new/page.js','portfolio/page.js','proof/page.js']) {
    const source=readFileSync(new URL('../app/'+path,import.meta.url),'utf8');
    assert.doesNotMatch(source,/sendTransaction|localStorage/);
  }
});

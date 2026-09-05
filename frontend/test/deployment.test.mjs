import test from 'node:test';
import assert from 'node:assert/strict';
import { Interface, keccak256 } from 'ethers';
import { artifact, expectedTransaction, transactionMatches, verifyJournal, requireRuntime, VERSION, walletContext } from '../app/utils/deployment.mjs';

const account = '0x1111111111111111111111111111111111111111';
const address = '0x2222222222222222222222222222222222222222';
test('deployment calldata is compiled contract creation, with no native payment', async () => {
  for (let step = 0; step < 4; step++) {
    const tx = await expectedTransaction(step, account, {});
    assert.equal(tx.to, undefined);
    assert.ok(tx.data.length > 100);
    assert.equal(tx.value || 0n, 0n);
  }
  await assert.rejects(expectedTransaction(4, account, {}), /earlier/);
  const tx = await expectedTransaction(5, account, { RWATokenFactory: address });
  const decoded = new Interface(artifact('RWATokenFactory').abi).parseTransaction(tx);
  assert.equal(decoded.name, 'createSampleToken');
  assert.equal(decoded.args[0], 900001n);
  assert.equal(tx.value, 0n);
});
test('transaction verification rejects changed value, account, network, calldata and destination', async () => {
  const expected = await expectedTransaction(0, account, {});
  const actual = { from: account, to: null, value: 0n, data: expected.data, chainId: 677n };
  assert.equal(transactionMatches(actual, expected, account), true);
  for (const changes of [{from:address},{value:1n},{chainId:968n},{data:'0x'},{to:address}]) assert.equal(transactionMatches({...actual,...changes},expected,account),false);
});
test('pending receipts cannot become completed deployment steps', async () => {
  const provider = { getNetwork: async()=>({chainId:677n}), getTransaction:async()=>null, getTransactionReceipt:async()=>null };
  const journal = { version: VERSION, account, entries:[{step:0,hash:'0x'+'a'.repeat(64)}] };
  await assert.rejects(verifyJournal(journal,provider),/pending/);
  await assert.rejects(verifyJournal({...journal,version:'old'},provider),/current release/);
});
test('runtime verification requires exact compiled code',async()=>{
  await assert.rejects(requireRuntime({getCode:async()=> '0x'},address,'PropertyRegistry'),/runtime/);
  const compiled=artifact('PropertyRegistry').runtimeBytecode;
  assert.equal(keccak256(compiled),artifact('PropertyRegistry').runtimeHash);
  await requireRuntime({getCode:async()=>compiled},address,'PropertyRegistry');
});
test('no wallet cannot silently create a signer',async()=>{
  await assert.rejects(walletContext(),/MetaMask/);
});

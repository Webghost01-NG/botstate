import { BrowserProvider, ContractFactory, FetchRequest, Interface, JsonRpcProvider, formatEther, keccak256 } from 'ethers';
import bundle from '../data/browser-artifacts.json' with { type: 'json' };
import { BOT_MAINNET_RPC_URL, getEthereumProvider } from './web3.js';

export const SAMPLE_ID = 900001;
export const EXPOSED_ACCOUNT = '0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2';
export const STEPS = ['Deploy property registry', 'Deploy token factory', 'Deploy marketplace', 'Deploy agent log', 'Register sample asset', 'Create free sample token'];
export const CONTRACT_NAMES = ['PropertyRegistry', 'RWATokenFactory', 'Marketplace', 'AgentActionLog'];
export const VERSION = bundle.version;
export const SOURCE_HASH = bundle.sourceHash;
export const artifact = name => bundle.contracts[name];
export const sameAddress = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();
export function readProvider() {
  const request = new FetchRequest(BOT_MAINNET_RPC_URL);
  request.timeout = 10000;
  return new JsonRpcProvider(request, undefined, { batchMaxCount: 1 });
}
export async function requireChain(provider) {
  if ((await provider.getNetwork()).chainId !== 677n) throw new Error('Expected BOT Chain mainnet (677).');
}
export async function expectedTransaction(step, account, addresses) {
  if (!Number.isInteger(step) || step < 0 || step >= STEPS.length) throw new Error('Invalid deployment step.');
  if (step < 4) {
    const item = artifact(CONTRACT_NAMES[step]);
    const factory = new ContractFactory(item.abi, item.bytecode);
    return factory.getDeployTransaction(...(step === 3 ? [account] : []));
  }
  const name = step === 4 ? 'PropertyRegistry' : 'RWATokenFactory';
  if (!addresses[name]) throw new Error('Verify earlier contract deployments first.');
  const iface = new Interface(artifact(name).abi);
  return {
    to: addresses[name], value: 0n,
    data: step === 4 ? iface.encodeFunctionData('registerProperty', [SAMPLE_ID, account, 'https://frontend-ecru-nu-85.vercel.app/samples/900001.json', 0, 'Fictional sample — no real property']) : iface.encodeFunctionData('createSampleToken', [SAMPLE_ID])
  };
}
export function transactionMatches(actual, expected, account) {
  return sameAddress(actual.from, account) && actual.value === 0n && actual.chainId === 677n
    && (actual.data || '').toLowerCase() === expected.data.toLowerCase()
    && (expected.to ? sameAddress(actual.to, expected.to) : actual.to === null);
}
export async function requireRuntime(provider, address, name) {
  const code = await provider.getCode(address);
  if (code === '0x' || keccak256(code) !== artifact(name).runtimeHash) throw new Error(name + ' runtime does not match this release.');
}
export async function verifyJournal(journal, provider) {
  await requireChain(provider);
  if (journal.version !== VERSION || !Array.isArray(journal.entries) || journal.entries.length > STEPS.length) throw new Error('This deployment file is not for the current release.');
  const addresses = {};
  const receipts = [];
  for (let step = 0; step < journal.entries.length; step++) {
    const entry = journal.entries[step];
    if (entry.step !== step || !/^0x[0-9a-f]{64}$/i.test(entry.hash)) throw new Error('Invalid deployment record.');
    const [tx, receipt] = await Promise.all([provider.getTransaction(entry.hash), provider.getTransactionReceipt(entry.hash)]);
    if (!receipt) throw new Error('Transaction pending or unavailable. Check confirmations; do not deploy it again.');
    if (receipt.status !== 1) throw new Error('Transaction reverted. Keep this receipt for diagnosis; do not repeat the whole deployment.');
    const expected = await expectedTransaction(step, journal.account, addresses);
    if (!tx || !transactionMatches(tx, expected, journal.account)) throw new Error('Transaction does not match the expected account, network, call or zero-value amount.');
    if (step < 4) {
      if (!receipt.contractAddress) throw new Error('Missing creation address.');
      await requireRuntime(provider, receipt.contractAddress, CONTRACT_NAMES[step]);
      addresses[CONTRACT_NAMES[step]] = receipt.contractAddress;
    }
    if (step === 5) {
      const iface = new Interface(artifact('RWATokenFactory').abi);
      const event = receipt.logs.filter(log => sameAddress(log.address, addresses.RWATokenFactory)).map(log => { try { return iface.parseLog(log); } catch { return null; } }).find(log => log?.name === 'TokenCreated' && log.args.propertyId === BigInt(SAMPLE_ID));
      if (!event) throw new Error('Sample token creation event is missing.');
      await requireRuntime(provider, event.args.tokenAddress, 'SamplePropertyToken');
      addresses.SamplePropertyToken = event.args.tokenAddress;
    }
    receipts.push({ step, hash: entry.hash, blockNumber: receipt.blockNumber, contractAddress: receipt.contractAddress });
  }
  return { addresses, receipts, completed: journal.entries.length };
}
export async function walletContext() {
  const injected = getEthereumProvider();
  if (!injected) throw new Error('Open this page in your MetaMask browser or a browser with MetaMask installed.');
  const accounts = await injected.request({ method: 'eth_accounts' });
  if (!accounts[0]) throw new Error('Connect MetaMask first.');
  if (BigInt(await injected.request({ method: 'eth_chainId' })) !== 677n) throw new Error('Switch MetaMask to BOT Chain mainnet first.');
  const provider = new BrowserProvider(injected);
  return { provider, signer: await provider.getSigner(accounts[0]), account: accounts[0] };
}
export async function estimateStep(journal, provider) {
  const wallet = await walletContext();
  if (!sameAddress(wallet.account, journal.account)) throw new Error('Select the account that started this deployment.');
  const verified = await verifyJournal(journal, provider);
  if (verified.completed === STEPS.length) return { verified, quote: null };
  const transaction = await expectedTransaction(verified.completed, wallet.account, verified.addresses);
  const gas = await provider.estimateGas({ ...transaction, from: wallet.account, value: 0n });
  const fees = await provider.getFeeData();
  if (!fees.gasPrice) throw new Error('Gas price unavailable.');
  const gasLimit = (gas * 120n + 99n) / 100n;
  const maxFee = gasLimit * fees.gasPrice;
  if (await provider.getBalance(wallet.account) < maxFee) throw new Error('Insufficient BOT for the estimated gas.');
  return { verified, quote: { account: wallet.account, step: verified.completed, transaction, gasLimit, gasPrice: fees.gasPrice, maxFee: formatEther(maxFee), createdAt: Date.now() } };
}
export async function sendQuotedStep(quote, journal, provider) {
  if (!quote || Date.now() - quote.createdAt > 120000) throw new Error('Refresh the gas estimate before signing.');
  const wallet = await walletContext();
  if (!sameAddress(wallet.account, quote.account) || !sameAddress(wallet.account, journal.account)) throw new Error('Wallet account changed.');
  const verified = await verifyJournal(journal, provider);
  if (verified.completed !== quote.step) throw new Error('Deployment changed. Refresh the estimate.');
  const expected = await expectedTransaction(quote.step, wallet.account, verified.addresses);
  if (expected.data !== quote.transaction.data || expected.to !== quote.transaction.to) throw new Error('Deployment transaction changed.');
  // This is invoked only by the explicit page button. MetaMask must authorize it.
  return wallet.signer.sendTransaction({ ...expected, value: 0n, gasLimit: quote.gasLimit, gasPrice: quote.gasPrice });
}

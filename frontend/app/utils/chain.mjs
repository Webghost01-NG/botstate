import { Interface, formatEther, formatUnits, isAddress, keccak256 } from 'ethers';
import activeDeployment from '../data/active-deployment.json' with { type: 'json' };
export const CHAIN_ID = 677;
export const RPC_URL = 'https://rpc.botchain.ai';
export const EXPLORER = 'https://scan.botchain.ai';
export const deployments = activeDeployment.records;
export async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(8000), cache: 'no-store' });
  if (!response.ok) throw new Error('Mainnet RPC unavailable.');
  const data = await response.json();
  if (data.error || data.result === undefined) throw new Error('Mainnet RPC returned an invalid response.');
  return data.result;
}
export async function requireMainnet(read = rpc) {
  if (BigInt(await read('eth_chainId')) !== 677n) throw new Error('RPC network mismatch.');
}
export function matchesDeployment(record, receipt, code) {
  return !!receipt && receipt.status === '0x1' && receipt.transactionHash?.toLowerCase() === record.txHash.toLowerCase()
    && receipt.contractAddress?.toLowerCase() === record.address.toLowerCase()
    && Number(BigInt(receipt.blockNumber)) === record.block && typeof code === 'string' && /^0x(?:[a-f0-9]{2})+$/i.test(code)
    && keccak256(code) === record.runtimeHash;
}
export async function deploymentEvidence(read = rpc) {
  await requireMainnet(read);
  return Promise.all(deployments.map(async record => {
    const [receipt, code] = await Promise.all([read('eth_getTransactionReceipt', [record.txHash]), read('eth_getCode', [record.address, 'latest'])]);
    return { ...record, status: matchesDeployment(record, receipt, code) ? 'receipt-and-code-confirmed' : 'not-verified' };
  }));
}
const registryAbi = new Interface(['function listActiveProperties() view returns ((uint256 propertyId,address owner,string metadataURI,uint256 aiValuation,string location,bool isActive,uint256 timestamp)[])']);
const factoryAbi = new Interface(['function propertyTokens(uint256) view returns (address)']);
const tokenAbi = new Interface(['function balanceOf(address) view returns (uint256)','function decimals() view returns (uint8)','function symbol() view returns (string)']);
async function call(read, address, abi, name, args, block) {
  const data = await read('eth_call', [{ to: address, data: abi.encodeFunctionData(name,args) }, block]);
  return abi.decodeFunctionResult(name, data);
}
export async function readPortfolio(address, read = rpc) {
  if (!isAddress(address)) throw new Error('Invalid wallet address.');
  await requireMainnet(read);
  const block = await read('eth_blockNumber');
  const walletBalance = formatEther(BigInt(await read('eth_getBalance', [address, block])));
  for (const record of deployments.slice(0,2)) {
    if ((await read('eth_getCode', [record.address, block])) === '0x') throw new Error('Required contract unavailable.');
  }
  const [properties] = await call(read, deployments[0].address, registryAbi, 'listActiveProperties', [], block);
  if (properties.length > 100) throw new Error('Portfolio scan exceeds this release’s capacity.');
  const holdings = [];
  for (const property of properties) {
    const [token] = await call(read, deployments[1].address, factoryAbi, 'propertyTokens', [property.propertyId], block);
    if (/^0x0{40}$/i.test(token)) continue;
    const [balance] = await call(read, token, tokenAbi, 'balanceOf', [address], block);
    if (balance === 0n) continue;
    const [[decimals], [symbol]] = await Promise.all([call(read,token,tokenAbi,'decimals',[],block), call(read,token,tokenAbi,'symbol',[],block)]);
    holdings.push({ propertyId: property.propertyId.toString(), token, symbol, balance: formatUnits(balance, decimals) });
  }
  return { chainId: CHAIN_ID, address, blockNumber: Number(BigInt(block)), walletBalance, holdings, scope: 'Tokens mapped by the active property registry; excludes unregistered or inactive assets.' };
}

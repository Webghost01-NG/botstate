import { Interface, formatEther, formatUnits, isAddress } from 'ethers';
export const CHAIN_ID = 677;
export const RPC_URL = 'https://rpc.botchain.ai';
export const EXPLORER = 'https://scan.botchain.ai';
export const deployments = [
  { name: 'PropertyRegistry', address: '0x8cd2DA9E45D18c47A803f065a3625AE68bF37B17', txHash: '0x5dcb2de31ea0b7c437f5aa8889a06a822c76b8d246b990a6c7d6a71b5f1e84d3', block: 20198070 },
  { name: 'RWATokenFactory', address: '0x0908E0409d593409D251306302FDca0C45198B9C', txHash: '0x824424b7e58248c4aff226a47f7f093d3c33836ed7e3745d03700aa64629e0d1', block: 20198081 },
  { name: 'Marketplace', address: '0x08D1B8fD3b831e79f000fFA3B1B0F69064080f24', txHash: '0xd5845d371dd8dce3aa2831ecf0640bc63436195e3b346a256ae5bffe0826f4b0', block: 20198086 },
  { name: 'AgentActionLog', address: '0xbb42F96B7Dd1FC127f7A9729C178EFE15ADa8F0a', txHash: '0x832067a6862a8d0c7909f9583ee819fc12c09f1a5e9b491d9273a5c194ecb66c', block: 20198091 }
];
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
    && Number(BigInt(receipt.blockNumber)) === record.block && typeof code === 'string' && code.length > 2;
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

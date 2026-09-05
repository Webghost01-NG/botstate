import { BrowserProvider } from 'ethers';
export const BOT_MAINNET_CHAIN_ID = '0x2a5';
export const BOT_MAINNET_RPC_URL = 'https://rpc.botchain.ai';
export const BOT_MAINNET_EXPLORER = 'https://scan.botchain.ai';
export const BOT_TESTNET_CHAIN_ID = '0x3c8';
export const BOT_TESTNET_RPC_URL = 'https://rpc.bohr.life';
export const BOT_TESTNET_EXPLORER = 'https://scan.bohr.life';
export function getEthereumProvider() {
  if (typeof window === 'undefined') return null;
  return window.ethereum?.providers?.find(p => p.isMetaMask) || window.ethereum || null;
}
export async function getAccount() {
  if (typeof window === 'undefined' || sessionStorage.getItem('botstate_disconnected')) return null;
  const provider = getEthereumProvider();
  return provider ? (await provider.request({ method: 'eth_accounts' }))[0] || null : null;
}
export async function connectWallet() {
  const provider = getEthereumProvider();
  if (!provider) throw new Error('Install an Ethereum-compatible wallet to connect. No demo account is connected.');
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  if (!accounts[0]) throw new Error('No wallet account selected.');
  sessionStorage.removeItem('botstate_disconnected');
  window.dispatchEvent(new Event('botstate-wallet'));
  return accounts[0];
}
export async function disconnectWallet() {
  sessionStorage.setItem('botstate_disconnected', 'true');
  window.dispatchEvent(new Event('botstate-wallet'));
}
async function switchChain(chainId, name, rpc, explorer, symbol) {
  const provider = getEthereumProvider();
  if (!provider) throw new Error('Wallet unavailable.');
  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
  } catch (error) {
    if (error.code !== 4902 && error.data?.originalError?.code !== 4902) throw error;
    await provider.request({ method: 'wallet_addEthereumChain', params: [{
      chainId, chainName: name, rpcUrls: [rpc], blockExplorerUrls: [explorer],
      nativeCurrency: { name: symbol, symbol, decimals: 18 }
    }] });
  }
  const actual = await provider.request({ method: 'eth_chainId' });
  if (BigInt(actual) !== BigInt(chainId)) throw new Error('Wallet is on the wrong network.');
}
export const switchToBotChainMainnet = () => switchChain(BOT_MAINNET_CHAIN_ID, 'BOT Chain Mainnet', BOT_MAINNET_RPC_URL, BOT_MAINNET_EXPLORER, 'BOT');
export const switchToBotChainTestnet = () => switchChain(BOT_TESTNET_CHAIN_ID, 'BOT Chain Testnet', BOT_TESTNET_RPC_URL, BOT_TESTNET_EXPLORER, 'tBOT');
export const getProvider = () => getEthereumProvider() ? new BrowserProvider(getEthereumProvider()) : null;

import { BrowserProvider } from 'ethers';

export const BOT_TESTNET_CHAIN_ID = '0x3C8'; // 968
export const BOT_TESTNET_RPC_URL = 'https://rpc.bohr.life';
export const BOT_TESTNET_EXPLORER = 'https://scan.bohr.life';

export const BOT_MAINNET_CHAIN_ID = '0x2A5'; // 677
export const BOT_MAINNET_RPC_URL = 'https://rpc.botchain.ai';

// Safe resolution of MetaMask in single-wallet or multi-wallet browser environments
export const getEthereumProvider = () => {
  if (typeof window === 'undefined') return null;

  if (window.ethereum) {
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const metaMaskProvider = window.ethereum.providers.find((p) => p.isMetaMask);
      if (metaMaskProvider) return metaMaskProvider;
    }
    return window.ethereum;
  }
  return null;
};

export const connectWallet = async () => {
  const provider = getEthereumProvider();

  if (provider) {
    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        try {
          await switchToBotChainTestnet();
        } catch (chainErr) {
          console.warn('Network switch notice:', chainErr);
        }
        return accounts[0];
      }
    } catch (error) {
      if (error.code === 4001) {
        console.warn('User rejected connection request.');
      } else {
        console.error('Error connecting to MetaMask', error);
      }
      throw error;
    }
  }

  console.info('MetaMask provider not detected, using demo test wallet session.');
  const demoAccount = '0x71C836443ab54c561563967b6232895E5eC949b2';
  if (typeof window !== 'undefined') {
    localStorage.setItem('botstate_demo_wallet', demoAccount);
  }
  return demoAccount;
};

export const getAccount = async () => {
  const provider = getEthereumProvider();

  if (provider) {
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        return accounts[0];
      }
    } catch (e) {
      console.warn('Error querying accounts', e);
    }
  }

  if (typeof window !== 'undefined') {
    return localStorage.getItem('botstate_demo_wallet') || null;
  }
  return null;
};

export const disconnectWallet = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('botstate_demo_wallet');
  }
};

export const switchToBotChainTestnet = async () => {
  const provider = getEthereumProvider();
  if (!provider) return;

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BOT_TESTNET_CHAIN_ID }],
    });
  } catch (switchError) {
    // Chain 968 not yet added to MetaMask (Error 4902)
    if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BOT_TESTNET_CHAIN_ID,
              chainName: 'BOT Chain Testnet',
              rpcUrls: [BOT_TESTNET_RPC_URL],
              blockExplorerUrls: [BOT_TESTNET_EXPLORER],
              nativeCurrency: {
                name: 'tBOT',
                symbol: 'tBOT',
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        console.warn('Error adding BOT Chain Testnet to MetaMask', addError);
      }
    }
  }
};

export const getProvider = () => {
  const provider = getEthereumProvider();
  if (provider) {
    return new BrowserProvider(provider);
  }
  return null;
};

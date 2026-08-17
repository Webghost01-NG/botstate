'use client';
import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getAccount, getEthereumProvider } from '../utils/web3';
import styles from './WalletButton.module.css';

export default function WalletButton() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const acc = await getAccount();
      if (acc) setAccount(acc);
    };
    init();

    const provider = getEthereumProvider();
    if (provider && provider.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      };

      provider.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const acc = await connectWallet();
      if (acc) setAccount(acc);
    } catch (error) {
      console.error('Wallet connection failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setAccount('');
  };

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (account) {
    return (
      <button 
        className={`btn btn-outline ${styles.walletBtn}`} 
        onClick={handleDisconnect}
        title="Click to disconnect"
      >
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', marginRight: '6px' }}></span>
        {formatAddress(account)}
      </button>
    );
  }

  return (
    <button 
      className={`btn btn-accent ${styles.walletBtn}`} 
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getAccount, getEthereumProvider } from '../utils/web3';
import styles from './WalletButton.module.css';

export default function WalletButton() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try { setAccount((await getAccount()) || ''); }
      catch { setAccount(''); }
    };
    init();

    const provider = getEthereumProvider();
    if (provider && provider.on) {
      const handleAccountsChanged = init;

      provider.on('accountsChanged', handleAccountsChanged);
      window.addEventListener('botstate-wallet', init);
      return () => {
        window.removeEventListener('botstate-wallet', init);
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const acc = await connectWallet();
      if (acc) setAccount(acc);
    } catch (error) {
      setError(error.message);
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
    <div>
    <button 
      className={`btn btn-accent ${styles.walletBtn}`} 
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
    {error && <p role="alert">{error}</p>}
    </div>
  );
}

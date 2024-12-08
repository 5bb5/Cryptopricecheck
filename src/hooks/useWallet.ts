import { useState, useCallback } from 'react';
import { connectWallet, getWalletBalance } from '../services/web3';
import { WalletBalance } from '../types/wallet';

export const useWallet = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const address = await connectWallet();
      const walletBalance = await getWalletBalance(address);
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      setBalance(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return {
    balance,
    isConnecting,
    error,
    connect
  };
};
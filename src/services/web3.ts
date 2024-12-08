import { ethers } from 'ethers';
import { WalletBalance } from '../types/wallet';

export const getWeb3Provider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('No Web3 Provider found');
};

export const connectWallet = async (): Promise<string> => {
  const provider = getWeb3Provider();
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

export const getWalletBalance = async (address: string): Promise<WalletBalance> => {
  const provider = getWeb3Provider();
  const balance = await provider.getBalance(address);
  
  return {
    address,
    balance: {
      ETH: parseFloat(ethers.formatEther(balance))
    },
    totalValueUSD: 0 // This should be calculated based on current ETH price
  };
};
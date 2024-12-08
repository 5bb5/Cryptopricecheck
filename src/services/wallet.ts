import { WalletBalance, Trade, TradeHistory } from '../types/wallet';

// Simulated wallet storage
let walletBalance: WalletBalance = {
  address: '',
  balance: {},
  totalValueUSD: 0
};

let tradeHistory: Trade[] = [];

export const connectWallet = async (): Promise<string> => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      walletBalance.address = accounts[0];
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  } else {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }
};

export const executeTrade = async (
  type: 'buy' | 'sell',
  coinId: string,
  amount: number,
  price: number
): Promise<Trade> => {
  const total = amount * price;
  
  if (type === 'buy') {
    // Update balance
    walletBalance.balance[coinId] = (walletBalance.balance[coinId] || 0) + amount;
  } else {
    // Check if user has enough balance
    if (!walletBalance.balance[coinId] || walletBalance.balance[coinId] < amount) {
      throw new Error('Insufficient balance');
    }
    walletBalance.balance[coinId] -= amount;
  }

  // Create trade record
  const trade: Trade = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    type,
    coinId,
    amount,
    price,
    total
  };

  tradeHistory.push(trade);
  return trade;
};

export const getWalletBalance = (): WalletBalance => {
  return { ...walletBalance };
};

export const getTradeHistory = (): TradeHistory => {
  const totalProfitLoss = tradeHistory.reduce((total, trade) => {
    return total + (trade.type === 'sell' ? trade.total : -trade.total);
  }, 0);

  return {
    trades: [...tradeHistory],
    totalProfitLoss
  };
};
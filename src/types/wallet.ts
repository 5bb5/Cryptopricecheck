export interface WalletBalance {
  address: string;
  balance: {
    [key: string]: number;  // crypto symbol -> amount
  };
  totalValueUSD: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  type: 'buy' | 'sell';
  coinId: string;
  amount: number;
  price: number;
  total: number;
}

export interface TradeHistory {
  trades: Trade[];
  totalProfitLoss: number;
}
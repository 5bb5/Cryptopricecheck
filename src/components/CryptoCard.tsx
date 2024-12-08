import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoData } from '../types/crypto';
import { TradingForm } from './TradingForm';

interface CryptoCardProps {
  crypto: CryptoData;
  onTrade: (type: 'buy' | 'sell', amount: number) => Promise<void>;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onTrade }) => {
  const isPositive = crypto.price_change_percentage_24h > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{crypto.name}</h3>
          <p className="text-gray-500 uppercase">{crypto.symbol}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-bold">${crypto.current_price.toLocaleString()}</p>
        <div className={`flex items-center mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="ml-1">{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-gray-600">
          Market Cap: ${crypto.market_cap.toLocaleString()}
        </p>
      </div>

      <TradingForm crypto={crypto} onTrade={onTrade} />
    </div>
  );
};
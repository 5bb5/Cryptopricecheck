import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { CryptoData } from '../types/crypto';

interface TradingFormProps {
  crypto: CryptoData;
  onTrade: (type: 'buy' | 'sell', amount: number) => Promise<void>;
}

export const TradingForm: React.FC<TradingFormProps> = ({ crypto, onTrade }) => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!amount) return;
    
    setIsLoading(true);
    try {
      await onTrade(type, parseFloat(amount));
      setAmount('');
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <DollarSign className="mr-2" /> Trade {crypto.name}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">
                {crypto.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          {amount && (
            <p className="mt-2 text-sm text-gray-500">
              ≈ ${(parseFloat(amount) * crypto.current_price).toFixed(2)}
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleTrade('buy')}
            disabled={isLoading || !amount}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade('sell')}
            disabled={isLoading || !amount}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};
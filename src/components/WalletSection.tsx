import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { WalletBalance, TradeHistory } from '../types/wallet';

interface WalletSectionProps {
  balance: WalletBalance;
  tradeHistory: TradeHistory;
  onConnect: () => void;
}

export const WalletSection: React.FC<WalletSectionProps> = ({
  balance,
  tradeHistory,
  onConnect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Wallet className="mr-2" /> Wallet
        </h2>
        {!balance.address ? (
          <button
            onClick={onConnect}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            {balance.address.slice(0, 6)}...{balance.address.slice(-4)}
          </p>
        )}
      </div>

      {balance.address && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Holdings</h3>
            <div className="space-y-3">
              {Object.entries(balance.balance).map(([symbol, amount]) => (
                <div key={symbol} className="flex justify-between items-center">
                  <span className="text-gray-600">{symbol.toUpperCase()}</span>
                  <span className="font-medium">{amount.toFixed(8)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Value</span>
                <span className="font-bold">${balance.totalValueUSD.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Recent Trades</h3>
            <div className="space-y-3">
              {tradeHistory.trades.slice(-5).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    {trade.type === 'buy' ? (
                      <ArrowDownRight className="text-green-500 mr-2" />
                    ) : (
                      <ArrowUpRight className="text-red-500 mr-2" />
                    )}
                    <div>
                      <p className="font-medium">
                        {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.coinId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(trade.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${trade.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {trade.amount} @ ${trade.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CryptoCard } from './components/CryptoCard';
import { AlertForm } from './components/AlertForm';
import { ActiveAlerts } from './components/ActiveAlerts';
import { TabNavigation } from './components/TabNavigation';
import { WalletSection } from './components/WalletSection';
import { fetchCryptoData, sendDiscordAlert, sendTelegramAlert } from './services/api';
import { connectWallet, executeTrade, getWalletBalance, getTradeHistory } from './services/wallet';
import { AlertConfig, CryptoData } from './types/crypto';
import { WalletBalance, TradeHistory } from './types/wallet';
import { RefreshCw } from 'lucide-react';

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({ address: '', balance: {}, totalValueUSD: 0 });
  const [tradeHistory, setTradeHistory] = useState<TradeHistory>({ trades: [], totalProfitLoss: 0 });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptoData(activeTab);
      setCryptoData(data);
      checkAlerts(data);
      updateWalletValue(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const updateWalletValue = (data: CryptoData[]) => {
    const balance = getWalletBalance();
    const totalValue = Object.entries(balance.balance).reduce((total, [coinId, amount]) => {
      const coin = data.find(c => c.id === coinId);
      return total + (coin ? amount * coin.current_price : 0);
    }, 0);
    setWalletBalance({ ...balance, totalValueUSD: totalValue });
    setTradeHistory(getTradeHistory());
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setWalletBalance(getWalletBalance());
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleTrade = async (coinId: string, type: 'buy' | 'sell', amount: number) => {
    try {
      const coin = cryptoData.find(c => c.id === coinId);
      if (!coin) throw new Error('Coin not found');
      
      await executeTrade(type, coinId, amount, coin.current_price);
      updateWalletValue(cryptoData);
    } catch (error) {
      console.error('Trade failed:', error);
      throw error;
    }
  };

  const checkAlerts = (data: CryptoData[]) => {
    alerts.forEach(async (alert) => {
      const coin = data.find((c) => c.id === alert.coinId);
      if (!coin) return;

      const shouldTrigger =
        (alert.type === 'above' && coin.current_price > alert.priceTarget) ||
        (alert.type === 'below' && coin.current_price < alert.priceTarget);

      if (shouldTrigger) {
        const message = `🚨 Alert: ${coin.name} (${coin.symbol.toUpperCase()}) is now ${
          alert.type === 'above' ? 'above' : 'below'
        } $${alert.priceTarget}! Current price: $${coin.current_price}`;

        switch (alert.notificationType) {
          case 'discord':
            await sendDiscordAlert(alert.notificationTarget, message);
            break;
          case 'telegram':
            const [botToken, chatId] = alert.notificationTarget.split(':');
            await sendTelegramAlert(botToken, chatId, message);
            break;
          case 'email':
            console.log('Email alert:', message);
            break;
        }
      }
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleAddAlert = (alert: AlertConfig) => {
    setAlerts([...alerts, alert]);
  };

  const handleRemoveAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <button
            onClick={loadData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading cryptocurrency data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cryptoData.map((crypto) => (
                  <CryptoCard
                    key={crypto.id}
                    crypto={crypto}
                    onTrade={(type, amount) => handleTrade(crypto.id, type, amount)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <WalletSection
              balance={walletBalance}
              tradeHistory={tradeHistory}
              onConnect={handleConnectWallet}
            />
            <AlertForm cryptoList={cryptoData} onAddAlert={handleAddAlert} />
            <ActiveAlerts
              alerts={alerts}
              cryptoData={cryptoData}
              onRemoveAlert={handleRemoveAlert}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
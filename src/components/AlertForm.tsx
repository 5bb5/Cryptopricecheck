import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Send } from 'lucide-react';
import { AlertConfig, CryptoData } from '../types/crypto';

interface AlertFormProps {
  cryptoList: CryptoData[];
  onAddAlert: (alert: AlertConfig) => void;
}

export const AlertForm: React.FC<AlertFormProps> = ({ cryptoList, onAddAlert }) => {
  const [alert, setAlert] = useState<Partial<AlertConfig>>({
    type: 'above',
    notificationType: 'email'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alert.coinId && alert.priceTarget && alert.notificationTarget) {
      onAddAlert(alert as AlertConfig);
      setAlert({ type: 'above', notificationType: 'email' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Set Price Alert
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={alert.coinId || ''}
            onChange={(e) => setAlert({ ...alert, coinId: e.target.value })}
          >
            <option value="">Select a coin</option>
            {cryptoList.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Price Target ($)</label>
            <input
              type="number"
              step="0.000001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={alert.priceTarget || ''}
              onChange={(e) => setAlert({ ...alert, priceTarget: parseFloat(e.target.value) })}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Alert Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={alert.type}
              onChange={(e) => setAlert({ ...alert, type: e.target.value as 'above' | 'below' })}
            >
              <option value="above">Price Above</option>
              <option value="below">Price Below</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notification Method</label>
          <div className="mt-2 flex space-x-4">
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-md ${
                alert.notificationType === 'email'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlert({ ...alert, notificationType: 'email' })}
            >
              <Mail className="mr-2" size={18} /> Email
            </button>
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-md ${
                alert.notificationType === 'discord'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlert({ ...alert, notificationType: 'discord' })}
            >
              <MessageSquare className="mr-2" size={18} /> Discord
            </button>
            <button
              type="button"
              className={`flex items-center px-4 py-2 rounded-md ${
                alert.notificationType === 'telegram'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setAlert({ ...alert, notificationType: 'telegram' })}
            >
              <Send className="mr-2" size={18} /> Telegram
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {alert.notificationType === 'email' ? 'Email Address' :
             alert.notificationType === 'discord' ? 'Discord Webhook URL' :
             'Telegram Chat ID'}
          </label>
          <input
            type={alert.notificationType === 'email' ? 'email' : 'text'}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={alert.notificationTarget || ''}
            onChange={(e) => setAlert({ ...alert, notificationTarget: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Set Alert
        </button>
      </div>
    </form>
  );
};
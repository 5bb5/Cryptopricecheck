import React from 'react';
import { AlertConfig, CryptoData } from '../types/crypto';
import { Bell, X } from 'lucide-react';

interface ActiveAlertsProps {
  alerts: AlertConfig[];
  cryptoData: CryptoData[];
  onRemoveAlert: (index: number) => void;
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({
  alerts,
  cryptoData,
  onRemoveAlert,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Active Alerts
      </h3>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500">No active alerts</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const coin = cryptoData.find((c) => c.id === alert.coinId);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">
                    {coin?.name} ({coin?.symbol.toUpperCase()})
                  </p>
                  <p className="text-sm text-gray-600">
                    Alert when price goes {alert.type} ${alert.priceTarget}
                  </p>
                  <p className="text-sm text-gray-500">
                    Via {alert.notificationType}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveAlert(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
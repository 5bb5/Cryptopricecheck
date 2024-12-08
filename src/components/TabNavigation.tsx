import React from 'react';
import { Rocket, TrendingUp, Coins, Sparkles } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'Top Coins', icon: Coins },
    { id: 'meme', label: 'Meme Coins', icon: Sparkles },
    { id: 'pump', label: 'Highest Gainers', icon: Rocket },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <div className="flex space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            activeTab === id
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Icon className="mr-2" size={18} />
          {label}
        </button>
      ))}
    </div>
  );
};
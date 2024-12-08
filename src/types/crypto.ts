export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

export interface AlertConfig {
  coinId: string;
  priceTarget: number;
  type: 'above' | 'below';
  notificationType: 'email' | 'discord' | 'telegram';
  notificationTarget: string;
}

export interface NotificationConfig {
  email?: string;
  discordWebhook?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}
import axios from 'axios';
import { CryptoData } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = async (category: string = 'all'): Promise<CryptoData[]> => {
  try {
    let endpoint = `${COINGECKO_API}/coins/markets?vs_currency=usd&sparkline=false`;
    
    switch (category) {
      case 'meme':
        endpoint += '&category=meme-token';
        break;
      case 'trending':
        endpoint += '&order=volume_desc';
        break;
      case 'pump':
        endpoint += '&order=price_change_24h_desc';
        break;
      default:
        endpoint += '&order=market_cap_desc';
    }

    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export const sendDiscordAlert = async (webhookUrl: string, message: string) => {
  try {
    await axios.post(webhookUrl, { content: message });
  } catch (error) {
    console.error('Error sending Discord alert:', error);
  }
};

export const sendTelegramAlert = async (botToken: string, chatId: string, message: string) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      { chat_id: chatId, text: message }
    );
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
  }
};
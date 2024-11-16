// api/chat.ts
import { UserInfo } from '@/components/ChatBot/types';

interface ChatResponse {
  response: {
    text: string;
    confidence?: number;
  };
  timestamp: string;
}

const prod = 'https://aa-hakathon-02b9f57bd733.herokuapp.com'
const dev = 'http://localhost:8000'

export async function sendMessage(
  message: string,
  messageContext: { role: string; content: string }[],
  userInfo: UserInfo,
  image?: string
): Promise<ChatResponse> {
  const response = await fetch(`${prod}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context: messageContext,
      userInfo,
      image
    }),
  });

  if (!response.ok) {
    throw new Error('Chat service unavailable');
  }

  return await response.json();
}

export const checkApiHealth = async () => {
  const response = await fetch(prod, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('API health check failed');
  }

  return true;
};
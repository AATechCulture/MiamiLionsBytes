// components/ChatBot/types.ts

export interface UserInfo {
  preferredLanguage?: string;
  travelHistory?: string[];
  preferences?: Record<string, any>;
}

export interface Message {
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'audio' | 'error';
  imageUri?: string;
  attachmentUrl?: string;
  confidence?: number;
}

export interface ChatResponse {
  response: {
    text: string;
    type: string;
    confidence: number;
  };
  suggested_actions: string[];
  timestamp: string;
}

export interface ChatContext {
  messages: Message[];
  userInfo: UserInfo;
}

export type SuggestedQuestion = {
  text: string;
  query: string;
  icon: string;
  gradientColors: [string, string];
};
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
}

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
  createdAt: Date;
}

export interface UserContext {
  name: string;
  recentMoods?: string[];
  currentStressors?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  ageGroup?: string;
  language: string;
  subscriptionTier: 'free' | 'premium' | 'professional';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionLog {
  id: string;
  userId: string;
  mood: string;
  moodScore: number;
  note?: string;
  createdAt: Date;
}
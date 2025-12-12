export interface User {
  id: string;
  email: string;
  name: string;
  ageGroup?: string;
  language: string;
  subscriptionTier: 'free' | 'premium' | 'professional';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface EmotionLog {
  _id: string;
  userId: string;
  mood: MoodType;
  moodScore: number;
  note?: string;
  createdAt: string;
}

export interface JournalEntry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  mood?: MoodType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  stressLevel: StressLevel;
  progress: number;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MoodType = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';
export type GoalCategory = 'health' | 'work' | 'personal' | 'relationships' | 'learning' | 'finance' | 'other';
export type StressLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface MoodStatistics {
  total: number;
  moodCounts: Record<string, number>;
  averageScore: number | string;
  weeklyData: WeeklyMoodData[];
}

export interface WeeklyMoodData {
  day: string;
  score: number;
  count: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin?: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  sendMessage: (message: string, conversationId?: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  startNewConversation: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
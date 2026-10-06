export type MessageRole = 'user' | 'model';

export type AssistantMode = 'general' | 'tutor' | 'coder' | 'math' | 'creative';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  mode: AssistantMode;
}

export interface ModeConfig {
  id: AssistantMode;
  name: string;
  description: string;
  badge: string;
  icon: string;
}

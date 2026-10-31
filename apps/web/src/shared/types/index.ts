/**
 * 자비서 (javisor) 공통 도메인 타입 정의
 */

export type ModelType = 'gemini-3.8-flash' | 'gemini-3.5-flash-lite';

export type PersonaType = 'classic' | 'brief' | 'tactical';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: ModelType;
  errorInfo?: {
    message: string;
    isOverloaded?: boolean;
  };
}

export interface SessionData {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  model: ModelType;
  isPinned: boolean;
  isArchived: boolean;
}

import { Message } from './api';

export interface ChatVersion {
  id: string;
  timestamp: number;
  messages: Message[];
}

export interface VersionHistory {
  versions: ChatVersion[];
  currentIndex: number;
}
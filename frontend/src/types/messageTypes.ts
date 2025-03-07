export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  receiver?: string; // Optional for global messages
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
}

export enum MessageType {
  GLOBAL = 'GLOBAL',
  PRIVATE = 'PRIVATE'
} 
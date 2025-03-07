import { Message } from '../types/messageTypes';

const API_URL = 'http://localhost:8443/api';

// Fetch all global messages
export const fetchGlobalMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/messages/global`);
    if (!response.ok) {
      throw new Error('Failed to fetch global messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching global messages:', error);
    return [];
  }
};

// Send a message to the global chat
export const sendGlobalMessage = async (content: string): Promise<Message | null> => {
  try {
    const response = await fetch(`${API_URL}/messages/global`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send global message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending global message:', error);
    return null;
  }
};

// Fetch private messages between two users
export const fetchPrivateMessages = async (recipientId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_URL}/messages/private/${recipientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch private messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching private messages:', error);
    return [];
  }
};

// Send a private message to another user
export const sendPrivateMessage = async (
  recipientId: string, 
  content: string
): Promise<Message | null> => {
  try {
    const response = await fetch(`${API_URL}/messages/private/${recipientId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send private message');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending private message:', error);
    return null;
  }
}; 
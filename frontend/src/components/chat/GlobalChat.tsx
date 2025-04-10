import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../../types/messageTypes';
import { chatStyles } from '../../styles/chatStyles';
import '../../styles/buttonAnimations.css';
import Button from '../ui/Button';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface GlobalChatProps {
  username: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('STOMP Connected');
          stompClient.subscribe('/topic/global', (message: IMessage) => {
            try {
              const receivedMessage: Message = JSON.parse(message.body);
              if (!receivedMessage.timestamp) {
                  receivedMessage.timestamp = new Date();
              } else {
                  receivedMessage.timestamp = new Date(receivedMessage.timestamp);
              }
              if (!receivedMessage.id) {
                  receivedMessage.id = `temp-${Date.now()}-${Math.random()}`;
              }
              setMessages(prev => [...prev, receivedMessage]);
            } catch (error) {
              console.error("Failed to parse message body:", message.body, error);
            }
          });

           const systemMessage: Message = {
              id: 'system-connect-' + Date.now(),
              content: `${username} joined the global yap session!`,
              sender: 'System',
              timestamp: new Date()
           };
           if (stompClient.active) {
               stompClient.publish({
                   destination: '/app/global',
                   body: JSON.stringify(systemMessage)
               });
           }

        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame.headers['message'], 'Body:', frame.body);
        },
        onWebSocketClose: () => {
          console.log('WebSocket Closed');
        },
         onWebSocketError: (event) => {
             console.error('WebSocket Error:', event);
         }
      });

      stompClient.activate();
      
      clientRef.current = stompClient;
    };

    if (username) {
        connectWebSocket();
    }

    return () => {
      if (clientRef.current?.active) {
        console.log('Deactivating STOMP client...');
         const systemMessage: Message = {
             id: 'system-disconnect-' + Date.now(),
             content: `${username} left the global yap session.`,
             sender: 'System',
             timestamp: new Date()
         };
         try {
            clientRef.current.publish({
                destination: '/app/global',
                body: JSON.stringify(systemMessage)
            });
         } catch (error) {
             console.error("Failed to publish disconnect message:", error);
         }
         setTimeout(() => {
             clientRef.current?.deactivate();
             console.log('STOMP client deactivated.');
         }, 100);
      } else {
          console.log('STOMP client already inactive or not initialized.');
      }
    };
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientRef.current?.active) {
        console.warn("Cannot send message: Input is empty or client is not active.");
        return;
    }
    
    const messageToSend: Partial<Message> = { 
      content: newMessage,
      sender: username
    };
    
    try {
        clientRef.current.publish({
          destination: '/app/global',
          body: JSON.stringify(messageToSend),
        });
        console.log("Message sent:", messageToSend);
        setNewMessage('');
    } catch (error) {
        console.error("Failed to send message via STOMP:", error);
    }
  };

  const systemMessageStyle = {
    ...chatStyles.messageContainer,
    ...chatStyles.receivedMessage,
    borderColor: 'rgb(96, 0, 175)',
    textAlign: 'center' as const,
    maxWidth: '20%',
    margin: '10px auto'
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-xl font-bold mb-4"></div>
      
      <div style={chatStyles.messagesArea}>
        {messages.map((message) => (
          <div 
            key={message.id}
            style={
              message.sender === 'System' 
                ? systemMessageStyle
                : {
                    ...chatStyles.messageContainer,
                    ...(message.sender === username ? chatStyles.sentMessage : chatStyles.receivedMessage)
                  }
            }
          >
            <div style={chatStyles.messageSender}>{message.sender}</div>
            <div style={chatStyles.messageTime}>
              {message.timestamp instanceof Date ? message.timestamp.toLocaleTimeString() : '...'}
            </div>
            <div 
              style={chatStyles.messageContent} 
              className={message.sender === 'System' ? 'typewriter-delay' : ''}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} style={chatStyles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          style={chatStyles.input}
          className="animated-input"
          placeholder="Your yapping goes here..."
          disabled={!clientRef.current?.active}
        />
        <Button 
          type="submit"
          animation="slide"
          margin="0 0 0 10px"
          padding="8px 16px"
          border="2px solid rgb(62, 0, 100)"
          disabled={!clientRef.current?.active || !newMessage.trim()}
        >
          Yap
        </Button>
      </form>
    </div>
  );
};

export default GlobalChat; 
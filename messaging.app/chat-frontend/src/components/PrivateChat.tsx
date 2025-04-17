import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Header from './Header'; // Import the new Header component

// Styles copied from frontend/src/styles/chatStyles.ts and adapted for dark mode
const chatStyles = {
  containerStyle2: {
    border: '2px solid #FFFFFF',
    borderRadius: '24px',
    // Remove explicit height
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#1a1a1a', // Dark grey background
    color: '#FFFFFF',
    width: '100%', // Ensure it takes full width of parent
    flexGrow: 1, // Make this container grow
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#1a1a1a', // Dark background for input area
    marginTop: 'auto',
  },
  input: {
    flexGrow: 1,
    padding: '8px 16px',
    backgroundColor: '#3a3a3a', // Dark input background
    border: '2px solid #555555',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    marginRight: '8px',
  },
  sendButton: {
    backgroundColor: '#BB86FC', // Example purple button
    color: 'black',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  messageContainer: {
    padding: '8px 12px',
    margin: '4px 0',
    maxWidth: '70%',
    borderRadius: '12px',
    position: 'relative' as const,
    minWidth: '80px',
    wordWrap: 'break-word' as const,
    color: '#FFFFFF',
    // Border is now defined in sent/received
    // backgroundColor is now defined in sent/received
  },
  sentMessage: {
    marginLeft: 'auto',
    backgroundColor: 'transparent', // Changed background
    border: '1px solid #FFFFFF', // White border
    color: '#FFFFFF', // White text
    alignSelf: 'flex-end',
    // Inherit padding, margin, etc. from messageContainer
  },
  receivedMessage: {
    marginRight: 'auto',
    backgroundColor: 'transparent', // Changed background
    border: '1px solid #03DAC6', // Teal/Blue border
    color: '#FFFFFF', // White text
    alignSelf: 'flex-start',
    // Inherit padding, margin, etc. from messageContainer
  },
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    color: 'white' // Ensure default text color
  },
  messageTime: {
    fontSize: '0.7rem',
    color: '#aaaaaa', // Lighter grey
    marginTop: '4px',
    textAlign: 'right' as const,
  },
  messageSender: {
      fontWeight: 'bold',
      fontSize: '0.8rem',
      marginBottom: '2px',
      color: '#BB86FC', // Accent color for sender name
  },
  messageContent: {
    fontSize: '0.9rem',
  },
  dateHeader: {
      textAlign: 'center' as const,
      margin: '16px 0 8px 0',
      color: '#aaaaaa', // Lighter grey
      fontWeight: 'bold',
      fontSize: '0.8rem',
  },
  // Style for the chat header within the container
  chatHeader: {
      backgroundColor: '#1f1f1f', // Dark header background
      color: '#FFFFFF', // White text
      padding: '10px 16px',
      fontSize: '1.1rem',
      fontWeight: 'semibold',
      borderBottom: '1px solid #333333'
  }
};
// End of copied styles

const PrivateChat = () => {
    const { receiverId } = useParams<{ receiverId: string }>();
    const { username: senderId } = useAuth();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling

    useEffect(() => {
        console.log('[PrivateChat] useEffect running. senderId:', senderId, 'receiverId:', receiverId);
        if (!receiverId || !senderId) {
            console.log('[PrivateChat] Missing senderId or receiverId, skipping WebSocket connection.');
            if (clientRef.current?.active) {
                console.log('[PrivateChat] Deactivating existing client due to missing IDs.');
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        const connectWebSocketAndLoadMessages = async () => {
            console.log('[PrivateChat] Attempting to load messages and connect WebSocket.');
            try {
                console.log('[PrivateChat] Fetching private messages.');
                const res = await api.get(`/messages/private`);
                const filtered = res.data.filter(
                    (msg: any) =>
                        (msg.senderId === senderId && msg.receiverId === receiverId) ||
                        (msg.senderId === receiverId && msg.receiverId === senderId)
                ).sort((a: any, b: any) => Number(a.timestamp) - Number(b.timestamp));
                setMessages(filtered);
                console.log('[PrivateChat] Private messages loaded:', filtered.length);
            } catch (err) {
                console.error("[PrivateChat] Failed to load private messages", err);
            }

            console.log('[PrivateChat] Setting up WebSocket connection.');
            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                debug: str => console.log('[PrivateChat STOMP]', str),
                onConnect: () => {
                    console.log('[PrivateChat] WebSocket connected.');
                    client.subscribe('/user/queue/private', (message: IMessage) => {
                        const body = JSON.parse(message.body);
                        console.log('[PrivateChat] Received message:', body);
                        if ((body.senderId === senderId && body.receiverId === receiverId) || (body.senderId === receiverId && body.receiverId === senderId)) {
                             setMessages(prev => [...prev, body].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('[PrivateChat] STOMP Error:', frame);
                },
                onWebSocketError: (event) => {
                    console.error('[PrivateChat] WebSocket Error:', event);
                }
            });

            console.log('[PrivateChat] Activating STOMP client.');
            client.activate();
            clientRef.current = client;
        };

        connectWebSocketAndLoadMessages();

        return () => {
            console.log('[PrivateChat] Cleanup: Deactivating STOMP client.');
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [receiverId, senderId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTimestamp = (timestamp: string | number): string => {
        if (!timestamp) return '';
        return new Date(Number(timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const getDateHeader = (timestamp: string | number): string => {
         if (!timestamp) return '';
         return new Date(Number(timestamp)).toLocaleDateString(undefined, {
             //weekday: 'long', // Keep it simple maybe
             year: 'numeric',
             month: 'long',
             day: 'numeric',
         });
     };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        console.log('[PrivateChat] Trying to send message. senderId:', senderId, 'receiverId:', receiverId, 'Input:', input, 'Client active:', clientRef.current?.active);
        if (clientRef.current?.active && input.trim() && senderId && receiverId) {
            clientRef.current.publish({
                destination: '/app/private',
                body: JSON.stringify({
                    content: input.trim(),
                    senderId,
                    receiverId,
                    timestamp: Date.now().toString()
                })
            });
            setInput('');
            console.log('[PrivateChat] Message published.');
        } else {
            console.log('[PrivateChat] Message not sent. Conditions not met.');
        }
    };

    const groupedMessages = messages.reduce((acc: { [key: string]: any[] }, msg: any) => {
        const date = getDateHeader(msg.timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        // Outer wrapper with flex column
        <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
             <Header title={`Chat with ${receiverId}`} />

             {/* Centering div: Add flexGrow: 1 and display: flex */}
             <div style={{ maxWidth: '1280px', width: '95%', margin: '20px auto', flexGrow: 1 /* Let this grow */, padding: '0 10px', display: 'flex' /* Needed for child flexGrow */ }}>
                {/* Chat container: remove explicit height, add flexGrow: 1 */}
                <div style={{...chatStyles.containerStyle2 /* height removed, flexGrow added */ }}>
                     {/* Messages Area */}
                     <div style={chatStyles.messagesArea}>
                        {Object.entries(groupedMessages).map(([date, msgsInDate]: [string, any[]]) => (
                            <React.Fragment key={date}>
                                <div style={chatStyles.dateHeader}>{date}</div>
                                {msgsInDate.map((msg: any, index: number) => (
                                    <div
                                        key={msg.id || `${date}-${index}`}
                                        style={{
                                            ...chatStyles.messageContainer,
                                            ...(msg.senderId === senderId ? chatStyles.sentMessage : chatStyles.receivedMessage)
                                        }}
                                    >
                                        {msg.senderId !== senderId && (
                                            <div style={chatStyles.messageSender}>{msg.senderId}</div>
                                        )}
                                        <div style={chatStyles.messageContent}>{msg.content}</div>
                                        <div style={chatStyles.messageTime}>{formatTimestamp(msg.timestamp)}</div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                         <div ref={messagesEndRef} />
                     </div>

                     {/* Input Area */}
                     <form onSubmit={handleSendMessage} style={chatStyles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={chatStyles.input}
                            placeholder={`Message ${receiverId}...`}
                        />
                        <button
                            type="submit"
                            style={chatStyles.sendButton}
                            className="btn-slide"
                        >
                            Send
                        </button>
                     </form>
                </div>
            </div>
        </div>
    );
};

export default PrivateChat;

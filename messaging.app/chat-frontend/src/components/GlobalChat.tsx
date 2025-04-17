import React, { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

// Styles copied and adapted from frontend/src/styles/chatStyles.ts
const chatStyles = {
  containerStyle1: {
    border: '2px solid #FFFFFF', // Changed border to white
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgb(30, 30, 30)', // Kept shadow
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#1a1a1a', // Dark background for chat container, not pure black for contrast
    width: '100%', // Ensure it takes full width of parent
    flexGrow: 1, // Make this container grow within its parent
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#2a2a2a', // Darker background for input area
    marginTop: 'auto',
  },
  input: {
    flexGrow: 1,
    padding: '8px 16px',
    backgroundColor: '#3a3a3a', // Dark input background
    border: '2px solid #555555', // Adjusted border
    borderRadius: '12px',
    color: 'white', // White text
    outline: 'none',
    marginRight: '8px',
  },
  sendButton: {
    backgroundColor: '#BB86FC', // Adjusted button color for dark theme (example: Material Purple)
    color: 'black',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    marginLeft: '10px',
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
    // Border is now defined in sent/received/system
    // backgroundColor is now defined in sent/received/system
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
   systemMessage: {
    textAlign: 'center' as const,
    maxWidth: '60%',
    margin: '10px auto',
    backgroundColor: 'transparent', // Changed background
    border: '1px solid #BB86FC', // Keep purple border
    color: '#BB86FC', // Keep purple text
    padding: '4px 8px',
    // Inherit other styles? Add borderRadius if needed
    borderRadius: '12px', // Added for consistency
  },
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    color: 'white' // Ensure default text color is white here too
  },
  messageTime: {
    fontSize: '0.7rem',
    color: '#aaaaaa', // Lighter grey for time
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
  }
};
// End of copied styles

const GlobalChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling
    const { username: senderId } = useAuth();

    useEffect(() => {
        console.log('[GlobalChat] useEffect running. senderId:', senderId);
        if (!senderId) {
            console.log('[GlobalChat] No senderId, skipping WebSocket connection.');
            if (clientRef.current?.active) {
                console.log('[GlobalChat] Deactivating existing client due to missing senderId.');
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        // Add initial system message simulation
        setMessages([{ id: 'system-welcome', content: 'Welcome to the global chat!', senderId: 'System', timestamp: Date.now().toString() }]);

        console.log('[GlobalChat] senderId found, attempting to connect WebSocket.');
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: str => console.log('[GlobalChat STOMP]', str),
            onConnect: () => {
                console.log('[GlobalChat] WebSocket connected.');
                client.subscribe('/topic/global', (message: IMessage) => {
                    const body = JSON.parse(message.body);
                    // Add message and sort
                    setMessages(prev => [...prev, body].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));
                });
            },
            onStompError: (frame) => { console.error('[GlobalChat] STOMP Error:', frame); },
            onWebSocketError: (event) => { console.error('[GlobalChat] WebSocket Error:', event); }
        });

        console.log('[GlobalChat] Activating STOMP client.');
        client.activate();
        clientRef.current = client;

        return () => {
            console.log('[GlobalChat] Cleanup: Deactivating STOMP client.');
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [senderId]);

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
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        console.log('[GlobalChat] Trying to send message. senderId:', senderId, 'Input:', input, 'Client active:', clientRef.current?.active);
        if (clientRef.current?.active && input.trim() && senderId) {
            clientRef.current.publish({
                destination: '/app/global',
                body: JSON.stringify({ content: input.trim(), senderId, timestamp: Date.now().toString() })
            });
            setInput('');
            console.log('[GlobalChat] Message published.');
        } else {
            console.log('[GlobalChat] Message not sent. Conditions not met.');
        }
    };

    const groupedMessages = messages.reduce((acc: { [key: string]: any[] }, msg: any) => {
        const timestamp = msg.timestamp || Date.now().toString();
        const date = getDateHeader(timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <div style={{ backgroundColor: '#000000', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="Global Chat" />

            <div style={{ maxWidth: '1280px', width: '95%', margin: '20px auto', flexGrow: 1, padding: '0 10px', display: 'flex' }}>
                 <div style={{...chatStyles.containerStyle1 }}>
                     <div style={chatStyles.messagesArea}>
                        {Object.entries(groupedMessages).map(([date, msgsInDate]: [string, any[]]) => (
                            <React.Fragment key={date}>
                                <div style={chatStyles.dateHeader}>{date}</div>
                                {msgsInDate.map((msg: any, index: number) => (
                                    <div
                                        key={msg.id || `${date}-${index}`}
                                        style={{
                                            ...chatStyles.messageContainer,
                                            ...(msg.senderId === 'System' ? chatStyles.systemMessage
                                                : msg.senderId === senderId ? chatStyles.sentMessage
                                                : chatStyles.receivedMessage)
                                        }}
                                    >
                                        {msg.senderId !== senderId && msg.senderId !== 'System' && (
                                            <div style={chatStyles.messageSender}>{msg.senderId}</div>
                                        )}
                                        {msg.senderId === 'System' && (
                                             <div style={{...chatStyles.messageSender, textAlign: 'center', width: '100%', color: '#BB86FC'}}>{msg.senderId}</div>
                                        )}
                                        <div style={chatStyles.messageContent}>{msg.content}</div>
                                        <div style={chatStyles.messageTime}>{formatTimestamp(msg.timestamp)}</div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                         <div ref={messagesEndRef} />
                     </div>

                     <form onSubmit={handleSendMessage} style={chatStyles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={chatStyles.input}
                            placeholder="Your yapping goes here..."
                        />
                        <button
                            type="submit"
                            style={chatStyles.sendButton}
                            className="btn-slide"
                        >
                            Yap
                        </button>
                     </form>
                </div>
             </div>
        </div>
    );
};

export default GlobalChat;

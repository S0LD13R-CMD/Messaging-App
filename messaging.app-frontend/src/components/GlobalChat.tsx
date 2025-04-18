import React, { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import createSockJS from '../api/websocket';

const chatStyles = {
  containerStyle1: {
    border: '2px solid #666666',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgb(30, 30, 30)',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'transparent',
    width: '100%',
    flexGrow: 1,
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    backgroundColor: 'transparent',
    marginTop: 'auto',
    minHeight: '50px',
    boxSizing: 'border-box' as const,
  },
  input: {
    flexGrow: 1,
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #666666',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    marginRight: '8px',
    fontFamily: 'inherit',
  },
  sendButton: {
    backgroundColor: 'transparent',
    color: '#BB86FC',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#666666',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    margin: '0px',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  sendButtonHover: {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
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
  },
  sentMessage: {
    marginLeft: 'auto',
    backgroundColor: 'transparent',
    border: '1px solid #666666',
    color: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    marginRight: 'auto',
    backgroundColor: 'transparent',
    border: '1px solid #666666',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
  },
   systemMessage: {
    textAlign: 'center' as const,
    maxWidth: '60%',
    margin: '10px auto',
    backgroundColor: 'transparent',
    border: '1px solid #666666',
    color: '#BB86FC',
    padding: '4px 8px',
    borderRadius: '12px',
  },
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    color: 'white',
  },
  messageTime: {
    fontSize: '0.7rem',
    color: '#aaaaaa',
    marginTop: '4px',
    textAlign: 'right' as const,
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginBottom: '2px',
    color: '#BB86FC',
  },
  messageContent: {
    fontSize: '0.9rem',
    whiteSpace: 'pre-wrap',
  },
  dateHeader: {
    textAlign: 'center' as const,
    margin: '16px 0 8px 0',
    color: '#aaaaaa',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  }
};

const GlobalChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isWsConnected, setIsWsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { username: senderId } = useAuth();
    const [sendHover, setSendHover] = useState(false);

    useEffect(() => {
        console.log('[GlobalChat] useEffect running. senderId:', senderId);
        if (!senderId) {
            console.log('[GlobalChat] No senderId, skipping WebSocket connection.');
            setIsWsConnected(false);
            if (clientRef.current?.active) {
                console.log('[GlobalChat] Deactivating existing client due to missing senderId.');
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        setMessages([{ id: 'system-welcome', content: 'Welcome to the global chat!', senderId: 'System', timestamp: Date.now().toString() }]);

        console.log('[GlobalChat] senderId found, attempting to connect WebSocket.');
        const socket = createSockJS();
        const client = new Client({
            webSocketFactory: () => socket,
            debug: str => console.log('[GlobalChat STOMP]', str),
            onConnect: () => {
                console.log('[GlobalChat] WebSocket connected.');
                setIsWsConnected(true);
                client.subscribe('/topic/global', (message: IMessage) => {
                    const body = JSON.parse(message.body);
                    setMessages(prev => [...prev, body].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));
                });
            },
            onDisconnect: () => {
                console.log('[GlobalChat] WebSocket disconnected.');
                setIsWsConnected(false);
            },
            onStompError: (frame) => {
                console.error('[GlobalChat] STOMP Error:', frame);
                setIsWsConnected(false);
            },
            onWebSocketError: (event) => {
                console.error('[GlobalChat] WebSocket Error:', event);
                setIsWsConnected(false);
            },
            onWebSocketClose: (event) => {
                 console.log('[GlobalChat] WebSocket closed.', event);
                 setIsWsConnected(false);
             }
        });

        console.log('[GlobalChat] Activating STOMP client.');
        client.activate();
        clientRef.current = client;

        return () => {
            console.log('[GlobalChat] Cleanup: Deactivating STOMP client.');
            setIsWsConnected(false);
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [senderId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTimestamp = (timestamp: string | number): string => {
        if (!timestamp) return '';
        return new Date(Number(timestamp)).toLocaleTimeString([], {
             hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
    };

    const getDateHeader = (timestamp: string | number): string => {
        if (!timestamp) return '';
        return new Date(Number(timestamp)).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        console.log('[GlobalChat] Trying to send message. isWsConnected:', isWsConnected, 'senderId:', senderId, 'Input:', input);
        if (isWsConnected && clientRef.current?.active && input.trim() && senderId) {
            clientRef.current.publish({
                destination: '/app/global',
                body: JSON.stringify({ content: input.trim(), senderId, timestamp: Date.now().toString() })
            });
            setInput('');
            console.log('[GlobalChat] Message published.');
        } else {
            console.log('[GlobalChat] Message not sent. Conditions not met (Connected:', isWsConnected, 'Active:', clientRef.current?.active, 'Input:', !!input.trim(), 'SenderId:', !!senderId, ')');
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

            <div style={{ maxWidth: '1280px', width: '95%', margin: '20px auto', padding: '0 10px', flexGrow: 1, display: 'flex' }}>
                 <div style={chatStyles.containerStyle1}>
                     <div style={chatStyles.messagesArea}>
                        {Object.entries(groupedMessages).map(([date, msgsInDate]: [string, any[]]) => (
                            <React.Fragment key={date}>
                                <div style={chatStyles.dateHeader}>{date}</div>
                                {msgsInDate.map((msg: any, index: number) => {
                                    const isSystem = msg.senderId === 'System';
                                    const isSender = msg.senderId === senderId;

                                    return isSystem ? (
                                        <div
                                            key={msg.id || `${date}-${index}-system`}
                                            style={{
                                                ...chatStyles.messageContainer,
                                                ...chatStyles.systemMessage,
                                                alignSelf: 'center',
                                                textAlign: 'center'
                                            }}
                                            className="typewriter"
                                        >
                                            {msg.content}
                                        </div>
                                    ) : (
                                        <div
                                            key={msg.id || `${date}-${index}`}
                                            style={{
                                                ...chatStyles.messageContainer,
                                                ...(isSender ? chatStyles.sentMessage : chatStyles.receivedMessage)
                                            }}
                                        >
                                            {!isSender && (
                                                <div style={chatStyles.messageSender}>{msg.senderId}</div>
                                            )}
                                            <div
                                                style={chatStyles.messageContent}
                                            >
                                                {msg.content}
                                            </div>
                                            <div style={chatStyles.messageTime}>{formatTimestamp(msg.timestamp)}</div>
                                        </div>
                                    );
                                })}
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
                            style={{
                                ...chatStyles.sendButton,
                                ...(sendHover ? chatStyles.sendButtonHover : {})
                            }}
                            className="btn-slide"
                            disabled={!isWsConnected}
                            onMouseEnter={() => setSendHover(true)}
                            onMouseLeave={() => setSendHover(false)}
                        >
                            Yap
                        </button>
                        {!isWsConnected && <span style={{ marginLeft: '10px', color: '#aaaaaa', fontSize: '0.8rem', alignSelf: 'center' }}>Connecting...</span>}
                     </form>
                </div>
             </div>
        </div>
    );
};

export default GlobalChat;

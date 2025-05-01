import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import api from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import createSockJS from '../api/websocket';
import { deletePrivateMessage } from '../api/privateMessages';

const chatStyles = {
  containerStyle2: {
    border: '2px solid #666666',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    width: '100%',
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
  },
  chatHeader: {
      backgroundColor: '#1f1f1f',
      color: '#FFFFFF',
      padding: '10px 16px',
      fontSize: '1.1rem',
      fontWeight: 'semibold',
      borderBottom: '1px solid #333333'
  }
};

const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#666666',
    borderRadius: '24px 0 0 24px',
    cursor: 'pointer',
    padding: '0 15px',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginRight: '10px',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
};

const backButtonHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.7)',
};

const PrivateChat = () => {
    const { receiverId } = useParams<{ receiverId: string }>();
    const { username: senderId } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isBackHover, setIsBackHover] = useState(false);
    const [isWsConnected, setIsWsConnected] = useState(false);
    const [sendHover, setSendHover] = useState(false);

    useEffect(() => {
        console.log('[PrivateChat] useEffect running. senderId:', senderId, 'receiverId:', receiverId);
        if (!receiverId || !senderId) {
            console.log('[PrivateChat] Missing senderId or receiverId, skipping WebSocket connection.');
            setIsWsConnected(false);
            if (clientRef.current?.active) {
                console.log('[PrivateChat] Deactivating existing client due to missing IDs.');
                clientRef.current.deactivate();
                clientRef.current = null;
            }
            return;
        }

        const connectWebSocketAndLoadMessages = async () => {
            console.log('[PrivateChat] Attempting to load messages and connect WebSocket.');
            setIsWsConnected(false);
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
            const socket = createSockJS();
            const client = new Client({
                webSocketFactory: () => socket,
                debug: str => console.log('[PrivateChat STOMP]', str),
                onConnect: () => {
                    console.log('[PrivateChat] WebSocket connected.');
                    setIsWsConnected(true);
                    client.subscribe('/user/queue/private', (message: IMessage) => {
                        const body = JSON.parse(message.body);
                        console.log('[PrivateChat] Received message:', body);
                        if ((body.senderId === senderId && body.receiverId === receiverId) || (body.senderId === receiverId && body.receiverId === senderId)) {
                             setMessages(prev => [...prev, body].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)));
                        }
                    });
                    client.subscribe('/user/queue/private-deleted', (message: IMessage) => {
                        const deletedId = message.body;
                        setMessages(prev => prev.filter(msg => msg.id !== deletedId));
                    });
                },
                onDisconnect: () => {
                    console.log('[PrivateChat] WebSocket disconnected.');
                    setIsWsConnected(false);
                },
                onStompError: (frame) => {
                    console.error('[PrivateChat] STOMP Error:', frame);
                    setIsWsConnected(false);
                },
                onWebSocketError: (event) => {
                    console.error('[PrivateChat] WebSocket Error:', event);
                    setIsWsConnected(false);
                },
                onWebSocketClose: (event) => {
                     console.log('[PrivateChat] WebSocket closed.', event);
                     setIsWsConnected(false);
                 }
            });

            console.log('[PrivateChat] Activating STOMP client.');
            client.activate();
            clientRef.current = client;
        };

        connectWebSocketAndLoadMessages();

        return () => {
            console.log('[PrivateChat] Cleanup: Deactivating STOMP client.');
            setIsWsConnected(false);
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [receiverId, senderId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleDeleteMessage = async (id: string) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await deletePrivateMessage(id);
        } catch (err) {
            console.error('PrivateChat failed to delete message: ', err);
        }
    };

    const formatTimestamp = (timestamp: string | number): string => {
        if (!timestamp) return '';
        return new Date(Number(timestamp)).toLocaleTimeString([], {
             hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
        });
    };

    const getDateHeader = (timestamp: string | number): string => {
         if (!timestamp) return '';
         return new Date(Number(timestamp)).toLocaleDateString(undefined, {
             year: 'numeric',
             month: 'long',
             day: 'numeric',
         });
     };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        console.log('[PrivateChat] Trying to send message. isWsConnected:', isWsConnected, 'senderId:', senderId, 'receiverId:', receiverId, 'Input:', input);
        if (isWsConnected && clientRef.current?.active && input.trim() && senderId && receiverId) {
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
            console.log('[PrivateChat] Message not sent. Conditions not met (Connected:', isWsConnected, 'Active:', clientRef.current?.active, 'Input:', !!input.trim(), 'SenderId:', !!senderId, 'ReceiverId:', !!receiverId, ')');
        }
    };

    const handleGoBack = () => {
        navigate('/users');
    };

    const groupedMessages = messages.reduce((acc: { [key: string]: any[] }, msg: any) => {
        const date = getDateHeader(msg.timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <div style={{ 
            backgroundColor: '#000000', 
            color: '#FFFFFF', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
             <Header title={`Chat with ${receiverId}`} />

             <div style={{ 
                 maxWidth: '1280px', 
                 width: '95%', 
                 margin: '0 auto', 
                 flexGrow: 1, 
                 padding: '0 10px', 
                 display: 'flex', 
                 alignItems: 'stretch',
                 overflow: 'hidden'
             }}>
                <button
                    onClick={handleGoBack}
                    style={{
                        ...backButtonStyle,
                        ...(isBackHover ? backButtonHoverStyle : {})
                    }}
                    onMouseEnter={() => setIsBackHover(true)}
                    onMouseLeave={() => setIsBackHover(false)}
                    title="Back to User List"
                >
                    ❮
                </button>

                <div style={{...chatStyles.containerStyle2, flexGrow: 1 }}>
                     <div style={{
                         ...chatStyles.messagesArea,
                         overflowY: 'auto'
                     }}>
                        {Object.entries(groupedMessages).map(([date, msgsInDate]: [string, any[]]) => (
                            <React.Fragment key={date}>
                                <div style={chatStyles.dateHeader}>{date}</div>
                                {msgsInDate.map((msg: any, index: number) => {
                                    const isSender = msg.senderId === senderId;
                                    return (
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
                                            <div style={chatStyles.messageTime}>{formatTimestamp(msg.timestamp)}
                                                {isSender && msg.id && (
                                                <button
                                                    style={{
                                                        ...chatStyles.messageTime,
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#FF6666',
                                                        fontSize: '0.6rem',
                                                        fontFamily: 'inherit',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Delete"
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                >
                                                    Delete
                                                </button>
                                                )}
                                            </div>
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
                            placeholder={`Message ${receiverId}...`}
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

export default PrivateChat;

import React, { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';

const GlobalChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const clientRef = useRef<Client | null>(null);
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

        console.log('[GlobalChat] senderId found, attempting to connect WebSocket.');
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: str => console.log('[GlobalChat STOMP]', str),
            onConnect: () => {
                console.log('[GlobalChat] WebSocket connected.');
                client.subscribe('/topic/global', (message: IMessage) => {
                    const body = JSON.parse(message.body);
                    setMessages(prev => [...prev, body]);
                });
            },
            onStompError: (frame) => {
                console.error('[GlobalChat] STOMP Error:', frame);
            },
            onWebSocketError: (event) => {
                console.error('[GlobalChat] WebSocket Error:', event);
            }
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

    const formatFullTimestamp = (timestamp: string) =>
        new Date(Number(timestamp)).toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

    const getRelativeTime = (timestamp: string) => {
        const now = Date.now();
        const diff = now - Number(timestamp);
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds} sec ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const getDateHeader = (timestamp: string) => {
        return new Date(Number(timestamp)).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const groupedMessages = messages.reduce((acc: any, msg: any) => {
        const date = getDateHeader(msg.timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    const sendMessage = () => {
        console.log('[GlobalChat] Trying to send message. senderId:', senderId, 'Input:', input, 'Client active:', clientRef.current?.active);
        if (clientRef.current?.active && input && senderId) {
            clientRef.current.publish({
                destination: '/app/global',
                body: JSON.stringify({ content: input, senderId })
            });
            setInput('');
            console.log('[GlobalChat] Message sent.');
        } else {
            console.log('[GlobalChat] Message not sent. Conditions not met.');
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(Number(timestamp)).toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div>
            <h2>Global Chat</h2>
            <div>
                {Object.entries(groupedMessages).map(([date, msgs]: any) => (
                    <div key={date}>
                        <div style={{marginTop: '1rem', fontWeight: 'bold'}}>-- {date} --</div>
                        {msgs.map((msg: any, idx: number) => (
                            <div key={idx}>
                                <b>[{formatFullTimestamp(msg.timestamp)}]
                                    {/* ({getRelativeTime(msg.timestamp)}) */} {msg.senderId}:</b> {msg.content}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default GlobalChat;

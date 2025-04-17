import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api/auth';
import { useAuth } from '../context/AuthContext';

const PrivateChat = () => {
    const { receiverId } = useParams<{ receiverId: string }>();
    const { username: senderId } = useAuth();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const clientRef = useRef<Client | null>(null);

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
                );
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
                        if (body.senderId === receiverId || body.receiverId === receiverId) {
                            setMessages(prev => [...prev, body]);
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


    const sendMessage = () => {
        console.log('[PrivateChat] Trying to send message. senderId:', senderId, 'receiverId:', receiverId, 'Input:', input, 'Client active:', clientRef.current?.active);
        if (clientRef.current?.active && input && senderId && receiverId) {
            clientRef.current.publish({
                destination: '/app/private',
                body: JSON.stringify({
                    content: input,
                    senderId,
                    receiverId,
                    privateChatroomId: [senderId, receiverId].sort().join('-')
                })
            });
            setInput('');
            console.log('[PrivateChat] Message sent.');
        } else {
            console.log('[PrivateChat] Message not sent. Conditions not met.');
        }
    };

    const groupedMessages = messages.reduce((acc: any, msg: any) => {
        const date = getDateHeader(msg.timestamp);
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});


    return (
        <div>
            <h2>Private Chat with {receiverId}</h2>
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

export default PrivateChat;

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
            // Ensure client is deactivated if senderId/receiverId becomes null
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
                // Fetch existing messages first
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

            // Setup WebSocket connection
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
                        // Ensure message is for the current chat
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
    }, [receiverId, senderId]); // Dependency array includes both IDs

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

    return (
        <div>
            <h2>Private Chat with {receiverId}</h2>
            <div>{messages.map((msg, idx) => <div key={idx}><b>{msg.senderId}:</b> {msg.content}</div>)}</div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default PrivateChat;

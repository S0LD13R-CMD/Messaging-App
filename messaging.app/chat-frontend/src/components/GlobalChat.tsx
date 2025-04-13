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
            // Ensure client is deactivated if senderId becomes null (e.g., on logout)
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
    }, [senderId]); // Dependency array includes senderId

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

    return (
        <div>
            <h2>Global Chat</h2>
            <div>{messages.map((msg, idx) => (
                <div key={idx}><b>{msg.senderId}:</b> {msg.content}</div>
            ))}</div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default GlobalChat;

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
        if (!senderId) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: str => console.log(str),
            onConnect: () => {
                client.subscribe('/topic/global', (message: IMessage) => {
                    const body = JSON.parse(message.body);
                    setMessages(prev => [...prev, body]);
                });
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [senderId]);

    const sendMessage = () => {
        if (clientRef.current && input && senderId) {
            clientRef.current.publish({
                destination: '/app/global',
                body: JSON.stringify({ content: input, senderId })
            });
            setInput('');
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

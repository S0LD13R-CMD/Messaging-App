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
        if (!receiverId || !senderId) return;

        const connectWebSocketAndLoadMessages = async () => {
            try {
                const res = await api.get(`/messages/private`);
                const filtered = res.data.filter(
                    (msg: any) =>
                        (msg.senderId === senderId && msg.receiverId === receiverId) ||
                        (msg.senderId === receiverId && msg.receiverId === senderId)
                );
                setMessages(filtered);
            } catch (err) {
                console.error("Failed to load private messages", err);
            }

            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                debug: str => console.log(str),
                onConnect: () => {
                    client.subscribe('/user/queue/private', (message: IMessage) => {
                        const body = JSON.parse(message.body);
                        if (body.senderId === receiverId || body.receiverId === receiverId) {
                            setMessages(prev => [...prev, body]);
                        }
                    });
                }
            });

            client.activate();
            clientRef.current = client;
        };

        connectWebSocketAndLoadMessages();

        return () => {
            clientRef.current?.deactivate();
        };
    }, [receiverId, senderId]);

    const sendMessage = () => {
        if (clientRef.current && input && senderId && receiverId) {
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

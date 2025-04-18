import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import createSockJS from '../api/websocket';

const WebSocketEchoTester = () => {
    const [status, setStatus] = useState('Disconnected');
    const [serverEcho, setServerEcho] = useState('');
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const socket = createSockJS();
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                client.subscribe('/user/queue/test-echo', (message) => {
                    setServerEcho(`Received from server: ${message.body}`);
                });

                client.publish({ destination: '/app/test-echo', body: 'ping' });
            },
            onStompError: (frame) => {
                setStatus(`STOMP error: ${frame.headers['message']}`);
            }
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, []);


    return (
        <div>
            <h3>WebSocket Echo Test</h3>
            <p>Status: {status}</p>
            <p>{serverEcho}</p>
        </div>
    );
};

export default WebSocketEchoTester;

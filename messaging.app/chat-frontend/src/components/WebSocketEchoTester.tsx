import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketEchoTester = () => {
    const [status, setStatus] = useState('Connecting...');
    const [serverEcho, setServerEcho] = useState('');

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
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

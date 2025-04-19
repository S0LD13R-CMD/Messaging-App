import SockJS from 'sockjs-client';

// Determine the WebSocket URL based on the current domain
const getWebSocketUrl = () => {
  const isHttps = window.location.protocol === 'https:';
  const domain = window.location.hostname;
  
  if (domain === 'localhost' || domain === '127.0.0.1') {
    return `http://localhost:8080/ws`;
  } else {
    const protocol = isHttps ? 'https' : 'http';
    return `${protocol}://${domain}/api/ws`;
  }
};

const createSockJS = () => {
  const wsUrl = getWebSocketUrl();
  console.log(`[WebSocket] Connecting to: ${wsUrl}`);
  return new SockJS(wsUrl);
};

export default createSockJS; 
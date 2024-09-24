import { io } from 'socket.io-client';
import { wsURL } from '../config';

let socket;

export const initializeSocket = (wsURL, token) => {
  if (!socket) {
    socket = io(wsURL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,  // Передача токена с сокетом
      },
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });
  
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

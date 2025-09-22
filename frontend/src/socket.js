import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001/';
var socket;


export const initSocket = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  socket = io(ENDPOINT);
  socket.emit('setup', user.user);
}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket connection not initialized');
  }
  return socket;
}
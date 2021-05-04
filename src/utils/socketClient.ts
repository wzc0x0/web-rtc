import { io } from 'socket.io-client';
//192.168.199.183:3000
//locahost:3000
const socket = io('192.168.199.183:3000', {
  reconnectionDelayMax: 10,
});

export default socket;

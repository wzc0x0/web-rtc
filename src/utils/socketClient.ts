import { io } from 'socket.io-client';
//192.168.199.183:3000
//localhost:3000
//hk.19921024.xyz:3000
const socket = io('https://hk.19921024.xyz', {
  reconnectionDelayMax: 10,
  secure: true,
});

export default socket;

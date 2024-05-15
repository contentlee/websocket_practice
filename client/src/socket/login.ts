import { socket } from '.';

// // socket On
// socket.onSignal('need_login');

// // socket Emit
// socket.registerEmit('login', 'id', 'callback');

const loginSocket = {
  needLogin: (callback: () => void) => socket.receive('need_login', callback),
  login: (id: string, callback: () => void) => socket.send('login', id, callback),
};

export default loginSocket;

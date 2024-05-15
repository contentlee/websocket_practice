import { io } from 'socket.io-client';

class SocketProvider {
  private socket = io('ws://192.168.0.122:8080');

  get() {
    console.log(this.socket);

    return this.socket;
  }

  send = (message: string, ...arg: any[]) => {
    this.socket.emit(message, ...arg);
  };

  receive = (message: string, callback: (...arg: any[]) => void) => {
    return {
      on: () => this.socket.on(message, callback),
      off: () => this.socket.off(message, callback),
    };
  };
}

export default new SocketProvider();

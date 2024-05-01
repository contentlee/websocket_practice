import { io } from 'socket.io-client';

// class SocketProvider {
//   socket = io('ws://192.168.0.122:8080');
//   emit: { [index: string]: (...arg: any[]) => void } = {};
//   on: { [index: string]: (done: (...arg: any[]) => void) => void } = {};
//   off: { [index: string]: (done: (...arg: any[]) => void) => void } = {};

//   registerEmit(message: string, ...arg: string[]) {
//     this.emit[message] = (obj) => this.socket.emit(message, ...arg.map((str) => obj[str]));
//   }

//   onSignal(message: string) {
//     this.on[message] = (done: (...arg: any[]) => void) => this.socket.on(message, done);
//     this.off[message] = (done: (...arg: any[]) => void) => this.socket.off(message, done);
//   }
// }

// export default new SocketProvider();

class SocketProvider {
  private socket = io('ws://192.168.0.122:8080');

  get() {
    return this.socket;
  }

  send(message: string, ...arg: any[]) {
    this.socket.emit(message, ...arg);
  }

  receive(message: string, callback: (...arg: any[]) => void) {
    return {
      on: () => this.socket.on(message, callback),
      off: () => this.socket.off(message, callback),
    };
  }
}

export default new SocketProvider();

import socket from './socket';

const callSocket = {
  cancelCall: (callback: () => void) => socket.receive('cancel_call', callback),
  rejectCall: (callback: () => void) => socket.receive('reject_call', callback),
  endCall: (callback: () => void) => socket.receive('end_call', callback),
  permitCall: (callback: () => void) => socket.receive('permit_call', callback),
  offer: (callback: (offer: RTCSessionDescriptionInit) => void) =>
    socket.receive('offer', callback),
  answer: (callback: (answer: RTCSessionDescriptionInit) => void) =>
    socket.receive('answer', callback),
  icecandidate: (callback: (candidate: RTCIceCandidateInit) => void) =>
    socket.receive('icecandidate', callback),

  sendCancel: (room_name: string, callback: () => void) =>
    socket.send('cancel_call', room_name, callback),
  sendPermit: (room_name: string, callback: () => void) =>
    socket.send('permit_call', room_name, callback),
  sendOffer: (room_name: string, offer: RTCSessionDescriptionInit, callback: () => void) =>
    socket.send('offer', room_name, offer, callback),
  sendAnswer: (room_name: string, answer: RTCSessionDescriptionInit, callback: () => void) =>
    socket.send('answer', room_name, answer, callback),
  sendIcecandidate: (room_name: string, cadidate: RTCIceCandidate, callback: () => void) =>
    socket.send('icecandidate', room_name, cadidate, callback),
  finishCall: (room_name: string, user_name: string, callback: () => void) =>
    socket.send('end_call', room_name, user_name, callback),
};

export default callSocket;

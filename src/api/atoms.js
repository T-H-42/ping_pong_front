import { atom, useRecoilState } from 'recoil';
import io from 'socket.io-client';
import { getJwtCookie } from './cookies'

export const usernameState = atom({
  key: 'usernameState',
  default: '',
});

export const friendsState = atom({
  key: 'FriendsState',
  default: null,
});

export const roomNameState = atom({
  key: 'roomNameState',
  default: '',
});

export const pingpongSocketState = atom({
  key: 'pingpongSocketState',
  default: null,
});

export const chatSocketState = atom({
  key: 'chatSocketState',
  default: null,
});


// const pingpongSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/ping_pong`, {
//   transports: ['websocket'],
//   auth: {
//     token: getJwtCookie('jwt'),
//   }
// });

// const chatSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/chat`, {
//   transports: ['websocket'],
//   auth: {
//     token: getJwtCookie('jwt'),
//   }
// });

// export const pingpongSocketState = atom({
//   key: 'pingpongSocketState',
//   default: pingpongSocket,
// });

// export const chatSocketState = atom({
//   key: 'chatSocketState',
//   default: chatSocket,
// });
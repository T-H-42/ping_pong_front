import io, { Socket } from 'socket.io-client';
import { getJwtCookie } from './cookies';

export const createPingpongSocket = (): Socket => {
    const pingpongSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/ping_pong`, {
        transports: ['websocket'],
        auth: { token: getJwtCookie('jwt') },
        autoConnect: false,
    });
    return pingpongSocket;
};

export const createChatSocket = (): Socket => {
    const chatSocket = io(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/chat`, {
        transports: ['websocket'],
        auth: { token: getJwtCookie('jwt') },
        autoConnect: false,
    });
    return chatSocket;
};

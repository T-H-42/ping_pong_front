import React from 'react';
import { ISocketContext } from '../types/ISocketContext';

export const SocketContext = React.createContext<ISocketContext>({
    pingpongSocket: null,
    chatSocket: null,
    gameSocket: null,
});

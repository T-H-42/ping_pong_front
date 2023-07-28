import React from 'react'
import { ISocketContext } from '../types/ISocketContext'
// interface SocketContext {
//   pingPongSocket: any
//   chatSocket: any
// }

export const SocketContext = React.createContext<ISocketContext>({
  pingPongSocket: null,
  chatSocket: null,
})

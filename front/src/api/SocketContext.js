import React from 'react'

const SocketContext = React.createContext({
  pingPongSocket: null,
  chatSocket: null,
});

export default SocketContext



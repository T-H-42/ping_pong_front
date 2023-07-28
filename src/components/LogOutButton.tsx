import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SocketContext } from '../api/SocketContext'
import { removeJwtCookie } from '../api/cookies'

const LogOutButton = () => {
  const { pingPongSocket, chatSocket } = useContext(SocketContext)
  const navigate = useNavigate()

  const logoutHandler = () => {
    // Cookies.remove('jwt');
    removeJwtCookie('jwt')
    pingPongSocket.disconnect()
    chatSocket.disconnect()
    navigate('/')
  }
  return <button onClick={logoutHandler}>로그아웃</button>
}

export default LogOutButton

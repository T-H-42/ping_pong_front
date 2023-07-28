import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Suspense, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { getJwtCookie } from './api/cookies'

import Login from './pages/root/Login'
import Main from './pages/main/Main'
import ChatRoom from './pages/room/ChatRoom'
import OAuth from './components/OAuth'
import TwoFactorAuth from './pages/two-factor-auth/TwoFactorAuth'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './components/NotFound'

import { SocketContext } from './api/SocketContext'

import { createPingpongSocket, createChatSocket } from './api/socket'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
    },
  },
})

function App() {
  console.log('앱 컴포넌트')

  const pingpongSocket = createPingpongSocket()
  const chatSocket = createChatSocket()
  const [isLog, setIsLog] = useState()

  if (getJwtCookie('jwt')) {
    pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` }
    pingpongSocket.connect()
    chatSocket.auth = { token: `${getJwtCookie('jwt')}` }
    chatSocket.connect()
  }

  return (
    <RecoilRoot>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <SocketContext.Provider value={{ pingpongSocket, chatSocket }}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<h1>Fucking Loading</h1>}>
                <Routes>
                  <Route path='/' element={<Login />}></Route>
                  <Route path='/redirect' element={<OAuth />}></Route>
                  <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                  <Route element={<PrivateRoute />}>
                    <Route path='/main' element={<Main />} />
                    <Route path='/room/:roomName' element={<ChatRoom />} />
                  </Route>
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Suspense>
            </QueryClientProvider>
          </BrowserRouter>
        </SocketContext.Provider>
      </div>
    </RecoilRoot>
  )
}

export default App

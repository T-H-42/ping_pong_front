import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import getJwtCookie from './api/cookies';
import Login from './pages/Login'
import Main from './pages/Main'
import ChatRoom from './pages/ChatRoom'
import OAuth from './components/OAuth';
import TwoFactorAuth from "./components/TwoFactorAuth"
import PrivateRoute from './components/PrivateRoute';
import SocketContext from './api/SocketContext'
import InfoContext from './api/InfoContext'
import NotFound from './components/NotFound'

import { createPingpongSocket, createChatSocket } from './api/socket'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true
    }
  }
})

function App() {
  console.log("앱 컴포넌트")

  const pingpongSocket = createPingpongSocket()
  const chatSocket = createChatSocket()
  const [isLog, setIsLog] = useState()
  
  if(getJwtCookie('jwt'))
  {
    pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
    pingpongSocket.connect()
    chatSocket.auth = { token: `${getJwtCookie('jwt')}`};
    chatSocket.connect()
  }


  return (
    <RecoilRoot>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <SocketContext.Provider value={{ pingpongSocket, chatSocket}}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<h1>Fucking Loading</h1>}>
                <Routes>
                  <Route path='/' element={<Login />}></Route>
                   <Route path='/redirect' element={<OAuth />}></Route>
                   <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                 {/* <Route path='/redirect' element={<OAuth />} />
                  <Route path='/main' element={<Main />}></Route>
                  <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                <Route path='/room/:roomName' element={<ChatRoom />} /> */}
                <Route element={<PrivateRoute />}>
                    <Route index path='/main' element={<Main />} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='/room/:roomName' element={<ChatRoom />} />
                  </Route>
                </Routes>
              </Suspense>
            </QueryClientProvider>
          </BrowserRouter>
        </SocketContext.Provider>
      </div>
    </RecoilRoot>
  );
}

export default App;

// import React, {useContext} from 'react'
// import  {Outlet, Navigate} from 'react-router-dom'
// import SocketContext from '../api/SocketContext'
// import getJwtCookie from '../api/cookies'
// import NotFound from '../components/NotFound'

// const PrivateRoute = (path, element) =>{
// 	const isLogin  = getJwtCookie('jwt');
  
//     return isLogin ? <Outlet />  : <Navigate to="/" />
// }

// export default PrivateRoute
import React from 'react';
import { Outlet, Navigate, Route } from 'react-router-dom';
import getJwtCookie from '../api/cookies';

function PrivateRoute() {
  const isLogin = getJwtCookie('jwt');

  return isLogin ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;

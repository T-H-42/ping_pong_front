import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getJwtCookie } from '../api/cookies'

function PrivateRoute() {
  const isLogin = getJwtCookie('jwt')

  return isLogin ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoute

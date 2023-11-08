import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getJwtCookie } from '../api/cookies';
import { removeJwtCookie } from '../api/cookies';

function PrivateRoute() {
    const isLogin = getJwtCookie('jwt');
        // if(isLogin)
        // {
        //         axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/profile`, {
        //         params: {
        //           username: 'taeheonk',
        //         },
        //         headers: {
        //           Authorization: `Bearer ${getJwtCookie('jwt')}`,
        //         },
        //       },
        //       ).catch((error : any) => {
                
        //          if(error?.response?.status === 401)
        //     {
        //         console.error('프로필 데이터 가져오기 오류ASDADASS:', error);
        //         removeJwtCookie('jwt');
                
        //     }
        //         throw error; // React Query에서 잡힐 수 있도록 에러를 다시 던집니다.
        //         })

        // }    
    return isLogin ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;

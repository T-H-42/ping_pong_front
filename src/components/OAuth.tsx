import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';
import { useMutation } from 'react-query';
import { Socket } from 'socket.io-client';

const fetchOauth = async ({ code }) => {
    const response = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/signin`,
    { code },
    {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    },);
    return (response);
}

const oauthSuccess = (data, sockets) => {
    // TODO: cookie 등록 삭제
    document.cookie = `jwt=${data.accessToken};  path=/`;
    localStorage.setItem('username', data.username);
    
    if (data.two_factor_authentication_status === true)
        return false;
    // QUESTION: 소켓 연결을 TFA와 Oauth 두 곳에서 하는 이유??
    // TODO: 쿠키 존재 여부 확인 필요한지 물어보기
    if (getJwtCookie('jwt')) {
        const values = Object.values(sockets);
        values.map((socket : Socket) => {
            socket.auth = { token: `${getJwtCookie('jwt')}` };
            socket.connect();
        });
    }
    return true;
}

const OAuth = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    
    const sockets = useContext(SocketContext);
    
    const navigate = useNavigate();
    const {data, mutate} = useMutation(fetchOauth, {
        onSuccess: (response) => {
        if (oauthSuccess(response.data, sockets) === false)
            return navigate('/two-factor-auth', {replace: true});
        return navigate('/main', {replace: true});
        }
        ,onError: (error) => {
            navigate('/', {replace: true});
        }
});

    useEffect(() => {
        mutate({code});
    }, []);

    return <h1>로그인 중 ...</h1>;
};

export default OAuth;
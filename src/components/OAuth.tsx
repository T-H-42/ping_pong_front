import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';

const OAuth = () => {
    console.log('오오스 컴포넌트');

    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const [loading, setLoading] = useState(true);
    const [twoFactor, setTwoFactorAuthentication] = useState(false);
    const [error, setError] = useState(false);

    const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext);

    useEffect(() => {
        setLoading(true);
        axios
            .post(
                `http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/signin`,
                { code },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            )
            .then((response) => {
                console.log('/user/signin 요청 성공');
                document.cookie = `jwt=${response.data.accessToken};  path=/`;
                console.log(`또끈: ${getJwtCookie('jwt')}`);
                console.log('response.data: ', response.data);
                localStorage.setItem('username', response.data.username);

                pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
                pingpongSocket.connect();
                chatSocket.auth = { token: `${getJwtCookie('jwt')}` };
                chatSocket.connect();
                gameSocket.auth = { token: `${getJwtCookie('jwt')}` };
                gameSocket.connect();

                setTwoFactorAuthentication(response.data.two_factor_authentication_status);

                setError(false);
                setLoading(false);
            })
            .catch((err) => {
                console.log(`/user/signin 요청 실패: ${err}`);
                alert('로그인 실패');
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h1>로그인 중 ...</h1>;
    }

    if (twoFactor) return <Navigate to="/two-factor-auth" replace={true} />;

    if (error) {
        return <Navigate to="/" replace={true} />;
    }
    return <Navigate to="/main" replace={true} />;
};

export default OAuth;

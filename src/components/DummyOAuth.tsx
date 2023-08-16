import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';

const DummyOAuth = () => {
    console.log('오오스 컴포넌트');

    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext);
    const location = useLocation();

    const searchParam = new URLSearchParams(location.search);
    const userInput = searchParam.get('input');

    useEffect(() => {
        setLoading(true);
        axios
            .post(
                `http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/adminSignin`,
                {
                    username: userInput,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            )
            .then((response) => {
                document.cookie = `jwt=${response.data.accessToken};  path=/`;
                console.log('response.data: ', response.data);
                localStorage.setItem('username', response.data.username);

                if (getJwtCookie('jwt')) {
                    console.log('jwt', getJwtCookie('jwt'));
                    console.log('/user/signin 요청 성공');
                    console.log(`또끈: ${getJwtCookie('jwt')}`);
                    pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
                    pingpongSocket.connect();
                    chatSocket.auth = { token: `${getJwtCookie('jwt')}` };
                    chatSocket.connect();
                    gameSocket.auth = { token: `${getJwtCookie('jwt')}` };
                    gameSocket.connect();
                }
                setError(false);
                setLoading(false);
            })
            .catch((err) => {
                /* err number 확인 후 분기처리 */
                console.log(`/user/signin 요청 실패: ${err}`);
                alert('로그인 실패');
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h1>로그인 중 ...</h1>;
    }

    if (error) {
        return <Navigate to="/" replace={true} />;
    }
    return <Navigate to="/main" replace={true} />;
};

export default DummyOAuth;

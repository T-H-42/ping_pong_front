import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getJwtCookie } from '../api/cookies';
import { SocketContext } from '../api/SocketContext';

const DummyOAuth = () => {
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
                localStorage.setItem('username', response.data.username);

                if (getJwtCookie('jwt')) {
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

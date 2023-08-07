import React, { useState, useContext, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getJwtCookie } from '../../api/cookies';
import { SocketContext } from '../../api/SocketContext';

const TwoFactorAuth = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        username: localStorage.getItem('username'),
        two_factor_authentication_code: null,
    });
    const { pingpongSocket, chatSocket } = useContext(SocketContext);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInfo({
            ...info,
            two_factor_authentication_code: parseInt(event.target.value, 10),
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(info);
        axios
            .post(`http://${process.env.REACT_APP_IP_ADDRESS}:4000/user/certificate`, info, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then((res) => {
                console.log('/user/certificate 요청 성공');
                console.log(`또끈2: ${getJwtCookie('jwt')}`);
                console.log('서버의 값', res.data);
                pingpongSocket.auth = { token: `${getJwtCookie('jwt')}` };
                pingpongSocket.connect();
                chatSocket.auth = { token: `${getJwtCookie('jwt')}` };
                chatSocket.connect();
                // if() {}

                navigate('/main');
            })
            .catch((err) => {
                console.log(`/user/certificate 요청 실패: ${err}`);
            });
    };

    return (
        <div>
            <h2>Two-Factor Authentication</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleChange} />
                <button type="submit">Authenticate</button>
            </form>
        </div>
    );
};

export default TwoFactorAuth;

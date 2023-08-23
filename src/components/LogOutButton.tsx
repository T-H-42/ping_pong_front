import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SocketContext } from '../api/SocketContext';
import { removeJwtCookie } from '../api/cookies';
import { Button } from '@mui/material';

const LogOutButton = () => {
    const { pingpongSocket, chatSocket, gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        pingpongSocket.disconnect();
        chatSocket.disconnect();
        gameSocket.disconnect();
        removeJwtCookie('jwt');
        navigate('/');
    };
    return <Button variant='contained' onClick={logoutHandler}>로그아웃</Button>;
};

export default LogOutButton;

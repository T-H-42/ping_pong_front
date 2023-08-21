import React, { useContext, useEffect, useState } from 'react';
import PingPongContainer from './PingPongContainer';
import PaddleManager from './PaddleManager';
import ModalContainer from '../../components/ModalContainer';
import GameResultContainer from './GameResultContainer';
import { SocketContext } from '../../api/SocketContext';
import { useNavigate } from 'react-router';

const Layout = () => {
    const { gameSocket } = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const confirmRefresh = (event) => {
            event.preventDefault();
            event.returnValue = '';
            console.log('새로고침 에밋');

            gameSocket.emit('ft_leave_setting_room', (response: any) => {
                if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
            });
        };
        const confirmGoBack = (event) => {
            event.preventDefault();
            const result = window.confirm('현재 정보를 잃으실 수 있습니다. 정말로 뒤로 가시겠습니까?');
            if (result) {
                console.log('백으로 에밋');
                gameSocket.emit('ft_leave_setting_room', (response: any) => {
                    if (!response.success) return alert(`설정 방 나가기 실패 :  ${response.payload}`);
                });
                navigate('/main');
            }
        };
        window.addEventListener('popstate', confirmGoBack);
        window.addEventListener('beforeunload', confirmRefresh);

        return () => {
            window.removeEventListener('beforeunload', confirmRefresh);
            window.removeEventListener('popstate', confirmGoBack);
        };
    }, []);

    useEffect(() => {
        const handleEnemyLeaveGameRoom = (response) => {
            if (!response) {
                return alert(`${response} 에러가 발생했습니다.`);
            }
            alert(`${response.username}님이 나갔습니다.`);
            navigate('/');
        };

        gameSocket.on('ft_enemy_leave_room', handleEnemyLeaveGameRoom);

        return () => {
            gameSocket.off('ft_enemy_leave_room', handleEnemyLeaveGameRoom);
        };
    }, [gameSocket, navigate]);

    return (
        <>
            <PaddleManager />
            <PingPongContainer />
        </>
    );
};

export default Layout;
